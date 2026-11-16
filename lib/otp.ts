import crypto from "crypto";
import { redis } from "./redis";

// ─── OTP Store & Verification Service (Hybrid: Redis + Secure Memory Cache) ───
// Cryptographically secure OTP storage.
// Salt + HMAC-SHA256 hashing, 5m expiry, attempt limit (max 5),
// resend cooldown (30s), and single-use burn upon verification.
// If Redis is configured and available, persists to Redis.
// Otherwise, uses a secure in-memory cache with identical guarantees.

export type OtpType = "registration" | "login" | "reset";

interface OtpRecord {
  email: string;
  salt: string;
  codeHash: string;
  type: OtpType;
  createdAt: number;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  maxAttempts: number;
  metadata?: Record<string, unknown>;
}

const OTP_TTL_SECONDS = 5 * 60;        // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000;  // 30 seconds
const MAX_ATTEMPTS = 5;

// In-memory fallback store
declare global {
  var __otpMemoryStore: Map<string, OtpRecord> | undefined;
}

const memoryStore: Map<string, OtpRecord> =
  global.__otpMemoryStore || (global.__otpMemoryStore = new Map());

function getStoreKey(email: string, type: OtpType): string {
  return `otp:${type}:${email.trim().toLowerCase()}`;
}

function hashCode(code: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(code).digest("hex");
}

async function saveRecord(key: string, record: OtpRecord): Promise<void> {
  // Always update memory store
  memoryStore.set(key, record);

  // If redis is available, sync to Redis
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(record), { ex: OTP_TTL_SECONDS });
    } catch (err) {
      console.warn("[Redis Set Fallback to Memory]", err);
    }
  }
}

async function getRecord(key: string): Promise<OtpRecord | null> {
  // Try Redis first if configured
  if (redis) {
    try {
      const raw = await redis.get<string | OtpRecord>(key);
      if (raw) {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      }
    } catch (err) {
      console.warn("[Redis Get Fallback to Memory]", err);
    }
  }

  // Fallback to memory store
  const record = memoryStore.get(key);
  if (!record) return null;

  // Enforce memory expiration
  if (Date.now() > record.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  return record;
}

async function deleteRecord(key: string): Promise<void> {
  memoryStore.delete(key);
  if (redis) {
    try {
      await redis.del(key);
    } catch {}
  }
}

/**
 * Generate a cryptographically secure 6-digit OTP, hash it, and store with 5m TTL.
 * Returns the raw code to deliver to the user via email. The raw code is NEVER stored.
 */
export async function generateOtp(
  email: string,
  type: OtpType,
  metadata?: Record<string, unknown>
): Promise<{ code: string; expiresAt: number; resendAvailableAt: number }> {
  const normalizedEmail = email.trim().toLowerCase();
  const key = getStoreKey(normalizedEmail, type);
  const now = Date.now();

  const code = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString("hex");
  const codeHash = hashCode(code, salt);

  const record: OtpRecord = {
    email: normalizedEmail,
    salt,
    codeHash,
    type,
    createdAt: now,
    expiresAt: now + OTP_TTL_SECONDS * 1000,
    resendAvailableAt: now + RESEND_COOLDOWN_MS,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    metadata,
  };

  await saveRecord(key, record);

  return {
    code,
    expiresAt: record.expiresAt,
    resendAvailableAt: record.resendAvailableAt,
  };
}

/**
 * Check if a resend is allowed (enforces 30s cooldown).
 */
export async function canResendOtp(
  email: string,
  type: OtpType
): Promise<{ allowed: boolean; waitSeconds?: number }> {
  const key = getStoreKey(email, type);
  const record = await getRecord(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (now < record.resendAvailableAt) {
    const waitSeconds = Math.ceil((record.resendAvailableAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

/**
 * Verify the OTP code submitted by the user using timing-safe comparison against hash.
 * Upon success, burns the OTP (one-time use).
 */
export async function verifyOtp(
  email: string,
  submittedCode: string,
  type: OtpType
): Promise<{ valid: boolean; error?: string; metadata?: Record<string, unknown> }> {
  const normalizedEmail = email.trim().toLowerCase();
  const key = getStoreKey(normalizedEmail, type);
  const record = await getRecord(key);

  if (!record) {
    return {
      valid: false,
      error: "No verification code found or it has already been used. Please request a new code.",
    };
  }

  const now = Date.now();

  // Check expiration
  if (now > record.expiresAt) {
    await deleteRecord(key);
    return {
      valid: false,
      error: "Verification code has expired (5-minute limit). Please request a new code.",
    };
  }

  // Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    await deleteRecord(key);
    return {
      valid: false,
      error: "Too many failed attempts. For your security, this code was invalidated. Please request a new code.",
    };
  }

  // Increment attempts and persist
  record.attempts += 1;
  await saveRecord(key, record);

  // Compare using constant-time comparison
  const cleanSubmitted = submittedCode.trim();
  const submittedHash = hashCode(cleanSubmitted, record.salt);

  const isMatch =
    submittedHash.length === record.codeHash.length &&
    crypto.timingSafeEqual(
      Buffer.from(submittedHash, "hex"),
      Buffer.from(record.codeHash, "hex")
    );

  if (!isMatch) {
    const remaining = record.maxAttempts - record.attempts;
    if (remaining <= 0) {
      await deleteRecord(key);
      return {
        valid: false,
        error: "Incorrect code. Maximum attempts exceeded. Please request a new code.",
      };
    }
    return {
      valid: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // ── Success: Burn OTP so it cannot be reused ──
  const metadata = record.metadata;
  await deleteRecord(key);

  return { valid: true, metadata };
}
