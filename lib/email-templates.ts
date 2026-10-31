// ─── OneStop AI Email Templates ───
// Branded HTML templates matching the app's dark theme and design system.

const BRAND = {
  name: "OneStop AI",
  logo: "🎯",
  primaryColor: "#8083ff",
  primaryGradient: "linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)",
  bgDark: "#0f131c",
  bgCard: "#1c2028",
  textPrimary: "#dfe2ee",
  textSecondary: "#908fa0",
  borderColor: "#464554",
  accent: "#4cd7f6",
};

function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bgDark};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bgDark};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:36px;height:36px;border-radius:10px;background:${BRAND.primaryGradient};display:inline-flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(128,131,255,0.3);">
                  ${BRAND.logo}
                </div>
                <span style="font-size:18px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:-0.02em;">
                  One<span style="color:${BRAND.primaryColor};">Stop</span>
                </span>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <div style="background-color:${BRAND.bgCard};border:1px solid ${BRAND.borderColor};border-radius:16px;padding:32px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
                <!-- Accent line -->
                <div style="height:2px;background:${BRAND.primaryGradient};border-radius:2px;margin-bottom:24px;"></div>
                ${content}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:${BRAND.textSecondary};">
                &copy; ${new Date().getFullYear()} ${BRAND.name} &middot; 5 Frontier AI Models in One Workspace
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:${BRAND.borderColor};">
                This email was sent by ${BRAND.name}. If you did not expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Welcome Email (Sign Up) ───
export function welcomeEmail(userName: string): { subject: string; html: string; text: string } {
  const subject = `Welcome to OneStop AI, ${userName}! 🚀`;

  const html = baseLayout(
    "Welcome",
    `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.textPrimary};">Welcome aboard, ${userName}! 🎉</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">
      Your OneStop AI account is ready. You now have access to <strong style="color:${BRAND.textPrimary};">5 frontier AI models</strong> — GPT-4o, Claude 3.5, Gemini 1.5, Grok 2, and Perplexity Sonar Pro — all in one powerful workspace.
    </p>
    <div style="background-color:${BRAND.bgDark};border:1px solid ${BRAND.borderColor};border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:${BRAND.textPrimary};">Here's what you can do:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:4px 0;font-size:13px;color:${BRAND.textSecondary};">⚡ Ask one question, get 5 AI answers simultaneously</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:${BRAND.textSecondary};">📊 Compare responses side-by-side in grid view</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:${BRAND.textSecondary};">🎯 Find the best AI model for each task</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:${BRAND.textSecondary};">💾 Save and organize your conversations</td></tr>
      </table>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display:inline-block;padding:12px 28px;background:${BRAND.primaryGradient};color:#07006c;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(128,131,255,0.3);">
      Open Your Dashboard →
    </a>
    <p style="margin:16px 0 0;font-size:12px;color:${BRAND.textSecondary};">
      If you didn't create this account, please ignore this email.
    </p>
    `
  );

  const text = `Welcome to OneStop AI, ${userName}!\n\nYour account is ready. You now have access to 5 frontier AI models in one workspace.\n\nVisit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard\n\nIf you didn't create this account, please ignore this email.`;

  return { subject, html, text };
}

// ─── Email Verification OTP Email (Registration & Sign In) ───
export function verificationOtpEmail(
  userName: string,
  otpCode: string,
  type: "registration" | "login" | "reset" = "registration"
): { subject: string; html: string; text: string } {
  const isRegistration = type === "registration";
  const title = isRegistration
    ? "Verify Your Email Address"
    : type === "login"
    ? "Your OneStop AI Login Code"
    : "Reset Your Password";

  const actionText = isRegistration
    ? "completing your registration"
    : type === "login"
    ? "signing into your account"
    : "resetting your password";

  const subject = `${otpCode} is your OneStop AI verification code`;

  const html = baseLayout(
    title,
    `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.textPrimary};">${title}</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">
      Hi ${userName}, use the 6-digit verification code below for ${actionText}.
    </p>
    <div style="background-color:${BRAND.bgDark};border:1px solid ${BRAND.borderColor};border-radius:12px;padding:24px;margin-bottom:20px;text-align:center;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:${BRAND.textSecondary};text-transform:uppercase;letter-spacing:0.1em;">Security Verification Code</p>
      <div style="font-size:36px;font-weight:800;letter-spacing:0.2em;color:${BRAND.primaryColor};font-family:'Courier New',Courier,monospace;padding:6px 0;">
        ${otpCode}
      </div>
      <p style="margin:10px 0 0;font-size:12px;color:${BRAND.textSecondary};">
        Valid for <strong style="color:${BRAND.textPrimary};">5 minutes</strong> &middot; Single-use only
      </p>
    </div>
    <div style="background-color:${BRAND.bgDark};border-left:3px solid ${BRAND.accent};border-radius:4px;padding:12px 16px;margin-bottom:16px;">
      <p style="margin:0;font-size:12px;color:${BRAND.textSecondary};line-height:1.5;">
        Never share this code with anyone. OneStop AI staff will never ask for your verification code.
      </p>
    </div>
    <p style="margin:0;font-size:12px;color:${BRAND.textSecondary};line-height:1.5;">
      If you did not request this code, you can safely ignore this email.
    </p>
    `
  );

  const text = `${title}\n\nHi ${userName},\n\nYour 6-digit verification code for ${actionText} is: ${otpCode}\n\nThis code expires in 5 minutes and can only be used once.\n\nNever share this code with anyone. If you did not make this request, please ignore this email.`;

  return { subject, html, text };
}

// ─── Password Reset Email ───
export function passwordResetEmail(
  userName: string,
  resetCode: string
): { subject: string; html: string; text: string } {
  const subject = "Reset Your OneStop AI Password";

  const html = baseLayout(
    "Password Reset",
    `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.textPrimary};">Password Reset Request</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">
      Hi ${userName}, we received a request to reset your password. Use the code below to complete the process.
    </p>
    <div style="background-color:${BRAND.bgDark};border:1px solid ${BRAND.borderColor};border-radius:12px;padding:24px;margin-bottom:20px;text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:${BRAND.textSecondary};text-transform:uppercase;letter-spacing:0.05em;">Your Reset Code</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:0.15em;color:${BRAND.primaryColor};font-family:'Courier New',monospace;">
        ${resetCode}
      </div>
      <p style="margin:8px 0 0;font-size:11px;color:${BRAND.textSecondary};">
        This code expires in 15 minutes.
      </p>
    </div>
    <p style="margin:0;font-size:12px;color:${BRAND.textSecondary};line-height:1.5;">
      If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
    </p>
    `
  );

  const text = `Password Reset Request\n\nHi ${userName}, use this code to reset your OneStop AI password:\n\n${resetCode}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`;

  return { subject, html, text };
}

// ─── Contact / Feedback Email ───
export function contactEmail(
  senderName: string,
  senderEmail: string,
  message: string
): { subject: string; html: string; text: string } {
  const subject = `[OneStop Feedback] from ${senderName}`;

  const html = baseLayout(
    "Contact",
    `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.textPrimary};">New Feedback Received</h1>
    <div style="background-color:${BRAND.bgDark};border:1px solid ${BRAND.borderColor};border-radius:12px;padding:20px;margin:16px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr>
          <td style="padding:6px 0;font-size:12px;font-weight:600;color:${BRAND.textSecondary};width:80px;">From:</td>
          <td style="padding:6px 0;font-size:14px;color:${BRAND.textPrimary};">${senderName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;font-weight:600;color:${BRAND.textSecondary};width:80px;">Email:</td>
          <td style="padding:6px 0;font-size:14px;color:${BRAND.accent};">${senderEmail}</td>
        </tr>
      </table>
    </div>
    <div style="background-color:${BRAND.bgDark};border-left:3px solid ${BRAND.primaryColor};border-radius:4px;padding:16px 20px;margin-bottom:8px;">
      <p style="margin:0;font-size:14px;color:${BRAND.textPrimary};line-height:1.6;white-space:pre-wrap;">${message}</p>
    </div>
    <p style="margin:8px 0 0;font-size:11px;color:${BRAND.textSecondary};">
      Reply directly to this email to respond to ${senderName}.
    </p>
    `
  );

  const text = `New Feedback from ${senderName} (${senderEmail}):\n\n${message}`;

  return { subject, html, text };
}
