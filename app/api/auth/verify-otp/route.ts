import { NextRequest, NextResponse } from "next/server";
import { verifyOtp, type OtpType } from "@/lib/otp";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

// POST /api/auth/verify-otp
// Validates 6-digit OTP, checks expiration & attempts, burns OTP on success,
// and sets a secure HttpOnly session cookie for production-ready passwordless authentication.
// Body: { email: string, code: string, name?: string, type?: "registration" | "login" | "reset" }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, name, type = "login" } = body as {
      email?: string;
      code?: string;
      name?: string;
      type?: OtpType;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Verification code is required." },
        { status: 400 }
      );
    }

    const safeEmail = email.trim().toLowerCase().slice(0, 254);
    const safeCode = code.trim();
    const otpType: OtpType =
      type === "reset" ? "reset" : type === "registration" ? "registration" : "login";

    // 1. Verify OTP with cryptographic timing-safe check and burn
    const result = verifyOtp(safeEmail, safeCode, otpType);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    // Determine user display name
    const storedName =
      (result.metadata?.name as string) ||
      (name && typeof name === "string" ? name.trim().slice(0, 100) : "") ||
      safeEmail.split("@")[0];

    // 2. Issue secure signed session token
    const sessionToken = createSessionToken(safeEmail, storedName);

    // 3. Create response and attach HttpOnly, SameSite cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful! Welcome to OneStop AI.",
      user: {
        email: safeEmail,
        name: storedName,
        loggedInAt: new Date().toISOString(),
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err: unknown) {
    console.error("[API /auth/verify-otp Error]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while verifying your code." },
      { status: 500 }
    );
  }
}

