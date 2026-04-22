import { connectDB } from '@/lib/mongodb'
import { extractToken, verifyToken } from '@/lib/auth'
import { corsResponse, corsOptions } from '@/lib/cors'
import Audit from '@/models/Audit'

export async function OPTIONS() {
  return corsOptions()
}

// Add a fix to an existing audit
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(req)
    if (!token) return corsResponse({ error: 'Unauthorized' }, 401)

    const payload = verifyToken(token)
    const body = await req.json()

    await connectDB()

    const audit = await Audit.findOne({ _id: params.id, userId: payload.userId })
    if (!audit) return corsResponse({ error: 'Audit not found.' }, 404)

    audit.fixes.push({
      css: body.css ?? '',
      js: body.js ?? '',
      appliedAt: new Date(),
    })

    await audit.save()

    return corsResponse({ ok: true })
  } catch (err) {
    console.error('Save fix error:', err)
    return corsResponse({ error: 'Internal server error.' }, 500)
  }
}
