import { NextResponse } from "next/server";
import { verifySmtp } from "@/lib/email";

// GET /api/email/verify
// Tests the SMTP connection without sending an email.
// Returns { ok: true } if the SMTP handshake succeeds.

export async function GET() {
  try {
    const result = await verifySmtp();

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "SMTP connection failed. Check your environment variables.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "SMTP connection verified successfully.",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
    });
  } catch (err: unknown) {
    console.error("[API /email/verify]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "Failed to verify SMTP connection." },
      { status: 500 }
    );
  }
}
