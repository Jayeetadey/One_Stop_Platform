import { NextRequest, NextResponse } from "next/server";
import { generateOtp, canResendOtp, type OtpType } from "@/lib/otp";
import { sendEmail } from "@/lib/email";
import { verificationOtpEmail } from "@/lib/email-templates";

// POST /api/auth/send-otp
// Generates a 6-digit OTP, stores it with 10m expiry, and sends via Gmail SMTP.
// Body: { email: string, name?: string, type?: "registration" | "login" | "reset" }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, type = "registration" } = body as {
      email?: string;
      name?: string;
      type?: OtpType;
    };

    // ── Input Validation ──
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const safeEmail = email.trim().toLowerCase().slice(0, 254);
    const safeName = (name && typeof name === "string" ? name.trim().slice(0, 100) : "") || safeEmail.split("@")[0];
    const otpType: OtpType = type === "reset" ? "reset" : type === "login" ? "login" : "registration";

    // ── Check Resend Cooldown ──
    const resendCheck = canResendOtp(safeEmail, otpType);
    if (!resendCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${resendCheck.waitSeconds}s before requesting a new code.`,
          waitSeconds: resendCheck.waitSeconds,
        },
        { status: 429 }
      );
    }

    // ── Generate and Store OTP ──
    const { code, expiresAt, resendAvailableAt } = generateOtp(safeEmail, otpType, {
      name: safeName,
    });

    // ── Build Email Template ──
    const template = verificationOtpEmail(safeName, code, otpType);

    // ── Send Email via Gmail SMTP (Awaited) ──
    const sendResult = await sendEmail({
      to: safeEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error || "Failed to send verification code. Please check your email configuration.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent! Please check your email inbox (and spam folder).",
      expiresAt,
      resendAvailableAt,
    });
  } catch (err: unknown) {
    console.error("[API /auth/send-otp Error]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
