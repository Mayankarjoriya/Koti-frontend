/** @type {import('next').NextConfig} */

// Security headers — non-negotiable per the project brief, and doubly so
// for a cybersecurity client: the site itself is the first proof point.
// CSP is enforcing (not report-only) but scoped to exactly what the app
// loads: self, Cloudflare Turnstile, and inline styles (Tailwind/Next
// requirement — revisit with nonces if this becomes an audit blocker).
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      // 'unsafe-eval' is required by React/Next dev-mode instrumentation
      // (component stack reconstruction) — without it, dev-only effects can
      // throw and silently abort. Never shipped to production.
      `script-src 'self' 'unsafe-inline' ${
        process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval' "
      }https://challenges.cloudflare.com`,
      "frame-src https://challenges.cloudflare.com",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
