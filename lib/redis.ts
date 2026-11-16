import { Redis } from "@upstash/redis";

// ─── Upstash Redis Client (with graceful offline/in-memory fallback) ───
declare global {
  var __redisClient: Redis | null | undefined;
}

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  // If unconfigured or holding sample placeholders, gracefully return null
  if (
    !url ||
    !token ||
    url.includes("your-db") ||
    url.includes("placeholder") ||
    token.includes("token_here") ||
    token.length < 10
  ) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch (err) {
    console.warn("[Redis Init Warning] Could not initialize Upstash Redis:", err);
    return null;
  }
}

export const redis: Redis | null =
  global.__redisClient !== undefined
    ? global.__redisClient
    : (global.__redisClient = createRedisClient());
