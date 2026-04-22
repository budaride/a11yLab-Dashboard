import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Protect /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login/register
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For cookie-based API calls from web portal (me + audits)
  if (request.nextUrl.pathname.startsWith('/api/auth/me') || request.nextUrl.pathname.startsWith('/api/audits')) {
    if (!request.headers.get('Authorization') && token) {
      const headers = new Headers(request.headers)
      headers.set('Authorization', `Bearer ${token}`)
      return NextResponse.next({ request: { headers } })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/api/auth/me', '/api/audits/:path*'],
}
