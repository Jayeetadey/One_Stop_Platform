import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { contactEmail } from "@/lib/email-templates";

// POST /api/email/contact
// Sends feedback/contact form submissions to the site owner.
// Body: { name: string, email: string, message: string }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

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

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message is too long (max 5000 characters)." },
        { status: 400 }
      );
    }

    // Sanitize
    const safeName = name.trim().slice(0, 100);
    const safeEmail = email.trim().toLowerCase().slice(0, 254);
    // Basic XSS protection for HTML email
    const safeMessage = message
      .trim()
      .slice(0, 5000)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // ── Build and send email ──
    // Send to the site owner's email (SMTP_USER), with reply-to set to the sender
    const ownerEmail = process.env.SMTP_USER;
    if (!ownerEmail) {
      return NextResponse.json(
        { success: false, error: "Contact form is not configured." },
        { status: 503 }
      );
    }

    const template = contactEmail(safeName, safeEmail, safeMessage);
    const result = await sendEmail({
      to: ownerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: safeEmail,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon!",
    });
  } catch (err: unknown) {
    console.error("[API /email/contact]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
