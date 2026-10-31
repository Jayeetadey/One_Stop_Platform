import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

// POST /api/email/welcome
// Sends a branded welcome email when a new user signs up.
// Body: { name: string, email: string }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body as { name?: string; email?: string };

    // ── Input validation ──
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const safeName = name.trim().slice(0, 100);
    const safeEmail = email.trim().toLowerCase().slice(0, 254);

    // ── Build and send email ──
    const template = welcomeEmail(safeName);
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

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully.",
    });
  } catch (err: unknown) {
    // Never expose internal errors to the client
    console.error("[API /email/welcome]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
