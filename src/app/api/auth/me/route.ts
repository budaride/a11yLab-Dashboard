import { extractToken, verifyToken } from '@/lib/auth'
import { corsResponse, corsOptions } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptions()
}

export async function GET(req: Request) {
  try {
    const token = extractToken(req)
    if (!token) {
      return corsResponse({ error: 'No token provided.' }, 401)
    }

    const payload = verifyToken(token)
    return corsResponse({
      user: { userId: payload.userId, email: payload.email, name: payload.name },
    })
  } catch {
    return corsResponse({ error: 'Invalid or expired token.' }, 401)
  }
}
