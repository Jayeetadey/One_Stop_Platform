import { redis } from "./redis";

// ─── Rate Limiter (Hybrid: Upstash Redis with In-Memory Fallback) ───
// Protects endpoints like /api/chat and /api/auth/* from brute-force & denial of service.

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

interface MemoryLimitRecord {
  count: number;
  resetAt: number;
}

declare global {
  var __rateLimitMemoryStore: Map<string, MemoryLimitRecord> | undefined;
  var __rateLimitCleanupTimer: NodeJS.Timeout | undefined;
}

const memoryStore: Map<string, MemoryLimitRecord> =
  global.__rateLimitMemoryStore || (global.__rateLimitMemoryStore = new Map());

// Periodic cleanup of expired entries from in-memory store
if (typeof setInterval !== "undefined" && !global.__rateLimitCleanupTimer) {
  global.__rateLimitCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryStore.entries()) {
      if (now > value.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 60 * 1000);
}

/**
 * Checks rate limit for a given identifier (user UID or IP).
 * @param identifier Unique identifier (e.g. user UID or client IP)
 * @param action Action namespace (e.g. "chat", "auth")
 * @param options Configuration for limit and window in seconds
 */
export async function checkRateLimit(
  identifier: string,
  action = "chat",
  options: { limit?: number; windowSeconds?: number } = {}
): Promise<RateLimitResult> {
  const limit = options.limit ?? 30; // default 30 requests
  const windowSeconds = options.windowSeconds ?? 60; // per 60 seconds
  const cleanId = (identifier || "anonymous").trim().slice(0, 100);
  const key = `ratelimit:${action}:${cleanId}`;

  // 1. Try Redis first if configured
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }
      let ttl = await redis.ttl(key);
      if (ttl < 0) {
        ttl = windowSeconds;
      }

      const remaining = Math.max(0, limit - count);
      return {
        success: count <= limit,
        limit,
        remaining,
        resetInSeconds: ttl,
      };
    } catch (err) {
      console.warn("[RateLimit Redis Warning, falling back to memory]", err);
    }
  }

  // 2. In-Memory Fallback
  const now = Date.now();
  let record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    };
    memoryStore.set(key, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  record.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  const remaining = Math.max(0, limit - record.count);

  return {
    success: record.count <= limit,
    limit,
    remaining,
    resetInSeconds,
  };
}
