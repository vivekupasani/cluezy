import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

//anonymous users
export const unauthenticatedRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '1 d'), // 1 requests per 1 day
  analytics: true,
  prefix: '@upstash/ratelimit:unauth'
})

//authenticated users - free plan
export const authenticatedRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 d'), // 5 requests per 1 day
  analytics: true,
  prefix: '@upstash/ratelimit:auth'
})

// Helper function to get IP address from request
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] ?? realIp ?? 'unknown'
  return `ip:${ip}`
}
