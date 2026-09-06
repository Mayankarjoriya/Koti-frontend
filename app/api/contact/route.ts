import { NextRequest, NextResponse } from 'next/server'

// POST /api/contact
// Note: Backend responsibilities (validation, rate limiting, Turnstile verification, Resend email)
// have been offloaded to the FastAPI service at http://localhost:8000/api/contact.
// This route acts as a server-side proxy to the FastAPI backend.
export async function POST(req: NextRequest) {
  const backendUrl = process.env.FASTAPI_BACKEND_URL || process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const targetEndpoint = `${backendUrl.replace(/\/$/, '')}/api/contact`

  try {
    const body = await req.json()
    const payload = {
      ...body,
      turnstile_token: body.turnstile_token || body.turnstileToken,
      turnstileToken: body.turnstileToken || body.turnstile_token,
    }
    const response = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Next.js API Contact Proxy] Error forwarding request to FastAPI:', error)
    return NextResponse.json(
      { error: 'FastAPI backend service is currently unreachable at http://localhost:8000' },
      { status: 503 }
    )
  }
}
