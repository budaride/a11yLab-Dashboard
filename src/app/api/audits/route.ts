import { connectDB } from '@/lib/mongodb'
import { extractToken, verifyToken } from '@/lib/auth'
import { corsResponse, corsOptions } from '@/lib/cors'
import Audit from '@/models/Audit'

export async function OPTIONS() {
  return corsOptions()
}

// Save a new audit
export async function POST(req: Request) {
  try {
    const token = extractToken(req)
    if (!token) return corsResponse({ error: 'Unauthorized' }, 401)

    const payload = verifyToken(token)
    const body = await req.json()

    await connectDB()

    const audit = await Audit.create({
      userId: payload.userId,
      url: body.url,
      axeViolations: body.axeViolations ?? 0,
      htmlcsErrors: body.htmlcsErrors ?? 0,
      contrastErrors: body.contrastErrors ?? 0,
      incompleteCount: body.incompleteCount ?? 0,
      violations: body.violations ?? [],
      fixes: [],
    })

    return corsResponse({ id: audit._id }, 201)
  } catch (err) {
    console.error('Save audit error:', err)
    return corsResponse({ error: 'Internal server error.' }, 500)
  }
}

// List audits for current user
export async function GET(req: Request) {
  try {
    const token = extractToken(req)
    if (!token) return corsResponse({ error: 'Unauthorized' }, 401)

    const payload = verifyToken(token)

    await connectDB()

    const audits = await Audit.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return corsResponse({ audits })
  } catch (err) {
    console.error('List audits error:', err)
    return corsResponse({ error: 'Internal server error.' }, 500)
  }
}
