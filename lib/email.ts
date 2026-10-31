import nodemailer, { type Transporter } from "nodemailer";

// ─── SMTP Transporter (singleton) ───
// Uses your tested Gmail SMTP config: smtp.gmail.com:465 with SSL/TLS
// Credentials are read from server-side environment variables only.

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false"; // default true
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP environment variables are not configured. " +
        "Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env.local file."
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Connection pool for better performance
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });

  return transporter;
}

// ─── Verify SMTP connection ───
export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  try {
    const t = getTransporter();
    await t.verify();
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown SMTP error";
    return { ok: false, error: message };
  }
}

// ─── Generic send email ───
export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; messageId?: string; response?: string; error?: string }> {
  try {
    const t = getTransporter();
    const from = `OneStop AI <${process.env.SMTP_USER}>`;

    const info = await t.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      priority: "high",
      headers: {
        "X-Priority": "1 (Highest)",
        "X-MSMail-Priority": "High",
        "Importance": "High",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
    });

    // Server-side delivery confirmation log (safe — no credentials or tokens)
    console.log(`[SMTP Delivery Accepted] MessageID: ${info.messageId} | Response: ${info.response}`);

    return {
      success: true,
      messageId: info.messageId,
      response: typeof info.response === "string" ? info.response : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    // Invalidate transporter so subsequent attempts recreate a fresh connection
    transporter = null;
    console.error("[SMTP Send Error]", message);
    return { success: false, error: "Email delivery failed. Please check your email or try again later." };
  }
}
