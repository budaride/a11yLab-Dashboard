'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  name: string
}

interface AuditFix {
  css: string
  js: string
  appliedAt: string
}

interface AuditViolation {
  id: string
  impact: string
  description: string
  nodes: number
}

interface Audit {
  _id: string
  url: string
  axeViolations: number
  htmlcsErrors: number
  contrastErrors: number
  incompleteCount: number
  violations: AuditViolation[]
  fixes: AuditFix[]
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [audits, setAudits] = useState<Audit[]>([])
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error()
        const data = await res.json()
        setUser(data.user)
      })
      .catch(() => router.push('/login'))
  }, [router])

  useEffect(() => {
    if (!user) return
    fetch('/api/audits', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        setAudits(data.audits || [])
      })
      .catch(() => {})
  }, [user])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  function totalIssues(a: Audit) {
    return a.axeViolations + a.htmlcsErrors + a.contrastErrors
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function shortenUrl(url: string) {
    try {
      const u = new URL(url)
      return u.hostname + (u.pathname !== '/' ? u.pathname : '')
    } catch {
      return url
    }
  }

  // Stats
  const totalAudits = audits.length
  const totalIssuesFound = audits.reduce((s, a) => s + totalIssues(a), 0)
  const totalFixes = audits.reduce((s, a) => s + a.fixes.length, 0)

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-dark-600 bg-dark-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold">
            <span className="text-ocean-400">A11y</span>
            <span className="text-brand-400">Lab</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-dark-600 bg-dark-700 px-4 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-dark-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Welcome + Stats */}
        <div className="rounded-xl border border-dark-600 bg-dark-800 p-8">
          <h2 className="text-2xl font-bold text-gray-100">
            Welcome, {user.name}
          </h2>
          <p className="mt-2 text-gray-400">
            Your A11yLab account is active. Use the Chrome extension to start testing accessibility on any website.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-dark-600 bg-dark-900 p-5 text-center">
              <div className="text-3xl font-bold text-ocean-400">{totalAudits}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Audits Run</div>
            </div>
            <div className="rounded-lg border border-dark-600 bg-dark-900 p-5 text-center">
              <div className="text-3xl font-bold text-red-400">{totalIssuesFound}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Issues Found</div>
            </div>
            <div className="rounded-lg border border-dark-600 bg-dark-900 p-5 text-center">
              <div className="text-3xl font-bold text-brand-400">{totalFixes}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Fixes Applied</div>
            </div>
          </div>
        </div>

        {/* Audit History */}
        <div className="rounded-xl border border-dark-600 bg-dark-800 p-8">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Audit History</h3>

          {audits.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No audits yet. Run your first audit from the Chrome extension!
            </p>
          ) : (
            <div className="space-y-3">
              {audits.map((audit) => (
                <div key={audit._id} className="rounded-lg border border-dark-600 bg-dark-900 overflow-hidden">
                  {/* Audit row */}
                  <button
                    onClick={() => setExpandedAudit(expandedAudit === audit._id ? null : audit._id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-dark-800/50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate">{shortenUrl(audit.url)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{formatDate(audit.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 rounded bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-300">
                        {audit.axeViolations} axe
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-orange-900/30 px-2 py-0.5 text-xs font-medium text-orange-300">
                        {audit.htmlcsErrors} htmlcs
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
                        {audit.contrastErrors} contrast
                      </span>
                      {audit.fixes.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-300">
                          {audit.fixes.length} fix
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${expandedAudit === audit._id ? 'rotate-90' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expandedAudit === audit._id && (
                    <div className="border-t border-dark-600 px-5 py-4 space-y-4">
                      {/* Violations breakdown */}
                      {audit.violations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Violations</h4>
                          <div className="space-y-1">
                            {audit.violations.map((v, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className={`inline-block w-16 rounded px-1.5 py-0.5 text-center font-medium ${
                                  v.impact === 'critical' ? 'bg-red-900/30 text-red-300' :
                                  v.impact === 'serious' ? 'bg-orange-900/30 text-orange-300' :
                                  v.impact === 'moderate' ? 'bg-blue-900/30 text-blue-300' :
                                  'bg-gray-800 text-gray-400'
                                }`}>
                                  {v.impact}
                                </span>
                                <span className="text-gray-300 font-mono">{v.id}</span>
                                <span className="text-gray-500">({v.nodes} {v.nodes === 1 ? 'node' : 'nodes'})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fixes */}
                      {audit.fixes.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Applied Fixes</h4>
                          <div className="space-y-2">
                            {audit.fixes.map((fix, i) => (
                              <div key={i} className="rounded border border-dark-600 bg-dark-800 p-3">
                                <div className="text-xs text-gray-500 mb-1">{formatDate(fix.appliedAt)}</div>
                                {fix.css && (
                                  <div>
                                    <span className="text-[10px] font-semibold uppercase text-ocean-400">CSS</span>
                                    <pre className="mt-1 rounded bg-dark-900 px-3 py-2 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono">{fix.css}</pre>
                                  </div>
                                )}
                                {fix.js && (
                                  <div className={fix.css ? 'mt-2' : ''}>
                                    <span className="text-[10px] font-semibold uppercase text-brand-400">JavaScript</span>
                                    <pre className="mt-1 rounded bg-dark-900 px-3 py-2 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono">{fix.js}</pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {audit.violations.length === 0 && audit.fixes.length === 0 && (
                        <p className="text-xs text-gray-500">No violations or fixes to display.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
