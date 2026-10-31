import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { generateOtp } from "@/lib/otp";

// POST /api/email/reset-password
// Sends a password reset code to the user's email.
// Body: { email: string }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    // ── Input validation ──
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const safeEmail = email.trim().toLowerCase().slice(0, 254);

    // Generate a 6-digit reset code using the unified OTP store
    const { code: resetCode } = generateOtp(safeEmail, "reset");

    // Extract name from email for the template
    const userName = safeEmail.split("@")[0];

    // ── Build and send email ──
    const template = passwordResetEmail(userName, resetCode);
    const result = await sendEmail({
      to: safeEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 502 }
      );
    }

    // Return the code for demo purposes (in production, store it server-side and
    // verify it in a separate endpoint — NEVER return it to the client)
    return NextResponse.json({
      success: true,
      message: "Password reset code sent. Check your email.",
      // NOTE: Remove `code` in production. Only here for testing.
      code: resetCode,
    });
  } catch (err: unknown) {
    console.error("[API /email/reset-password]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
