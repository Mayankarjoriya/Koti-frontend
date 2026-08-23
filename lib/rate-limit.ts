// Simple in-memory sliding-window limiter for /api/contact.
// This is a low-traffic marketing site's contact form — an in-memory
// limiter is sufficient at this scale and avoids introducing a dependency
// (e.g. Upstash) the project doesn't otherwise need. Note: this resets on
// every cold start / redeploy and is per-instance, not shared across
// regions; revisit with a durable store only if abuse actually shows up.
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5

const hits = new Map<string, number[]>()

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  hits.set(key, timestamps)

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }

  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length }
}
