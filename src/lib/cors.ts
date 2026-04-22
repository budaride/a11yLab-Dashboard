const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function corsResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: CORS_HEADERS })
}

export function corsOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}
