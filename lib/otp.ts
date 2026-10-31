import crypto from "crypto";

// ─── OTP Store & Verification Service ───
// Cryptographically secure in-memory OTP storage with salt + HMAC-SHA256 hashing,
// 5-minute TTL expiry, attempt limit (max 5), resend cooldown (30s), and single-use burn.

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

// Global in-memory map to survive hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpRecord> | undefined;
}

const otpStore: Map<string, OtpRecord> =
  global.__otpStore || (global.__otpStore = new Map<string, OtpRecord>());

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

function getStoreKey(email: string, type: OtpType): string {
  return `${type}:${email.trim().toLowerCase()}`;
}

function hashCode(code: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(code).digest("hex");
}

/**
 * Generate a cryptographically secure 6-digit OTP code and store its hash with 5m expiry.
 * Returns the raw code to be delivered to the user via email. The raw code is NEVER stored.
 */
export function generateOtp(
  email: string,
  type: OtpType,
  metadata?: Record<string, unknown>
): { code: string; expiresAt: number; resendAvailableAt: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const key = getStoreKey(normalizedEmail, type);
  const now = Date.now();

  // Generate cryptographically secure 6-digit numeric OTP (100000 - 999999)
  const code = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString("hex");
  const codeHash = hashCode(code, salt);

  const record: OtpRecord = {
    email: normalizedEmail,
    salt,
    codeHash,
    type,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    resendAvailableAt: now + RESEND_COOLDOWN_MS,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    metadata,
  };

  // Overwrites any previous OTP for this email & type (invalidating old code)
  otpStore.set(key, record);

  // Periodically clean up expired records
  cleanupExpiredOtps();

  return {
    code,
    expiresAt: record.expiresAt,
    resendAvailableAt: record.resendAvailableAt,
  };
}

/**
 * Check if a resend is allowed (enforces 30s cooldown).
 */
export function canResendOtp(
  email: string,
  type: OtpType
): { allowed: boolean; waitSeconds?: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const key = getStoreKey(normalizedEmail, type);
  const record = otpStore.get(key);

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
export function verifyOtp(
  email: string,
  submittedCode: string,
  type: OtpType
): { valid: boolean; error?: string; metadata?: Record<string, unknown> } {
  const normalizedEmail = email.trim().toLowerCase();
  const key = getStoreKey(normalizedEmail, type);
  const record = otpStore.get(key);

  if (!record) {
    return {
      valid: false,
      error: "No verification code found or it has already been used. Please request a new code.",
    };
  }

  const now = Date.now();

  // Check expiration
  if (now > record.expiresAt) {
    otpStore.delete(key);
    return {
      valid: false,
      error: "Verification code has expired (5-minute limit). Please request a new code.",
    };
  }

  // Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    otpStore.delete(key);
    return {
      valid: false,
      error: "Too many failed attempts. For your security, this code was invalidated. Please request a new code.",
    };
  }

  record.attempts += 1;

  // Compare submitted code using constant-time comparison
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
      otpStore.delete(key);
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
  otpStore.delete(key);

  return { valid: true, metadata };
}

/**
 * Clean up expired records from the store.
 */
function cleanupExpiredOtps() {
  const now = Date.now();
  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(key);
    }
  }
}
