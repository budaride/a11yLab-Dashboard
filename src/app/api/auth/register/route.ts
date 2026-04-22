import { connectDB } from '@/lib/mongodb'
import { hashPassword, signToken } from '@/lib/auth'
import { corsResponse, corsOptions } from '@/lib/cors'
import User from '@/models/User'

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return corsResponse({ error: 'Email, password and name are required.' }, 400)
    }

    if (password.length < 8) {
      return corsResponse({ error: 'Password must be at least 8 characters.' }, 400)
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return corsResponse({ error: 'An account with this email already exists.' }, 409)
    }

    const hashed = await hashPassword(password)
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashed,
      name: name.trim(),
    })

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    })

    return corsResponse({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    }, 201)
  } catch (err) {
    console.error('Register error:', err)
    return corsResponse({ error: 'Internal server error.' }, 500)
  }
}
