import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { comparePassword, signToken } from '@/lib/auth'
import { corsResponse, corsOptions } from '@/lib/cors'
import User from '@/models/User'

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return corsResponse({ error: 'Email and password are required.' }, 400)
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return corsResponse({ error: 'Invalid email or password.' }, 401)
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return corsResponse({ error: 'Invalid email or password.' }, 401)
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    })

    // Set HTTP-only cookie for the web portal
    const response = NextResponse.json(
      { token, user: { id: user._id, email: user.email, name: user.name } },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  } catch (err) {
    console.error('Login error:', err)
    return corsResponse({ error: 'Internal server error.' }, 500)
  }
}
