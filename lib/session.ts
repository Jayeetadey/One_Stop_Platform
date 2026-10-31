import crypto from "crypto";

export interface SessionUser {
  email: string;
  name: string;
  issuedAt: number;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = "onestop_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Server-side HMAC secret for signing session cookies
const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  (process.env.SMTP_PASS ? `secret-${process.env.SMTP_PASS.slice(0, 10)}` : "onestop-default-server-secret-key-32b!");

/**
 * Creates a signed session token containing user identity and expiration.
 */
export function createSessionToken(email: string, name?: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = (name || cleanEmail.split("@")[0]).trim();
  const now = Date.now();
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;

  const payload: SessionUser = {
    email: cleanEmail,
    name: cleanName,
    issuedAt: now,
    expiresAt,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates a signed session token. Checks signature and expiration.
 */
export function verifySessionToken(token: string): {
  valid: boolean;
  user?: { email: string; name: string };
  error?: string;
} {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "Missing or malformed session token." };
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return { valid: false, error: "Invalid token parts." };
  }

  // Verify HMAC signature using timing-safe comparison
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return { valid: false, error: "Tampered or invalid session signature." };
  }

  try {
    const raw = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(raw) as SessionUser;

    if (!payload.email || !payload.expiresAt) {
      return { valid: false, error: "Incomplete session payload." };
    }

    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: "Session has expired." };
    }

    return {
      valid: true,
      user: {
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
      },
    };
  } catch {
    return { valid: false, error: "Corrupted session payload." };
  }
}
