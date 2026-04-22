'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        return
      }

      router.push('/login')
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-ocean-400">A11y</span>
            <span className="text-brand-400">Lab</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-dark-600 bg-dark-800 p-8 shadow-xl space-y-5">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-400 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-ocean-400 hover:text-ocean-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
