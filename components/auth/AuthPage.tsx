"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setAuthUser, getAuthUser, clearAuthUser, type AuthUser } from "@/lib/auth";

/* ─────────────────────────── SVG ICONS ─────────────────────────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={2} aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={2} aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ─────────────────────────── INPUT FIELD ─────────────────────────── */

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  suffix?: React.ReactNode;
}

function InputField({ id, label, type, placeholder, value, onChange, autoComplete, suffix }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#c7c4d7] tracking-wide uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full bg-[#0a0e16] border border-[#464554] rounded-xl px-4 py-3 text-sm text-[#dfe2ee] placeholder:text-[#908fa0] focus:outline-none focus:border-[#c0c1ff] focus:ring-2 focus:ring-[#c0c1ff]/20 transition-all duration-200 pr-10"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0]">{suffix}</div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── SOCIAL BUTTON ─────────────────────────── */

function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl border border-[#464554] bg-[#1c2028] hover:bg-[#262a33] hover:border-[#908fa0] text-sm font-medium text-[#dfe2ee] transition-all duration-200 active:scale-[0.98] cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ─────────────────────────── SIGN IN FORM ─────────────────────────── */

function SignInForm({ onSwitch, router }: { onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot password / OTP state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyingReset, setVerifyingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [resetCooldown, setResetCooldown] = useState(0);

  // Countdown timer for reset resend
  useEffect(() => {
    if (resetCooldown <= 0) return;
    const interval = setInterval(() => {
      setResetCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resetCooldown]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setLoginError("");

    setTimeout(() => {
      setAuthUser({
        name: email.split("@")[0],
        email,
        loggedInAt: new Date().toISOString(),
      });
      router.push("/dashboard");
    }, 1000);
  }, [email, password, router]);

  const handleSendResetCode = useCallback(async () => {
    if (!resetEmail || !resetEmail.includes("@")) return;
    setResetLoading(true);
    setResetStatus(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, type: "reset" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCodeSent(true);
        setResetCooldown(30);
        setResetStatus({ ok: true, message: data.message || "Reset code sent! Check your email inbox." });
      } else {
        setResetStatus({ ok: false, message: data.error || "Failed to send reset code. Please try again." });
      }
    } catch {
      setResetStatus({ ok: false, message: "Network connection error. Please try again." });
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail]);

  const handleVerifyReset = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.trim().length !== 6) {
      setResetStatus({ ok: false, message: "Please enter the 6-digit verification code." });
      return;
    }
    setVerifyingReset(true);
    setResetStatus(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code: resetOtpCode.trim(), type: "reset" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetStatus({ ok: true, message: "Code verified! Logging you in..." });
        setTimeout(() => {
          setAuthUser({
            name: resetEmail.split("@")[0],
            email: resetEmail,
            loggedInAt: new Date().toISOString(),
          });
          router.push("/dashboard");
        }, 800);
      } else {
        setResetStatus({ ok: false, message: data.error || "Invalid verification code." });
      }
    } catch {
      setResetStatus({ ok: false, message: "Verification failed. Please check your connection." });
    } finally {
      setVerifyingReset(false);
    }
  }, [resetEmail, resetOtpCode, router]);

  const handleSocialLogin = (provider: "Google" | "GitHub") => {
    setAuthUser({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      loggedInAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  // ── Forgot password / OTP Reset View ──
  if (forgotMode) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            setForgotMode(false);
            setCodeSent(false);
            setResetStatus(null);
            setResetOtpCode("");
          }}
          className="flex items-center gap-1 text-xs text-[#908fa0] hover:text-[#c0c1ff] transition-colors self-start cursor-pointer"
        >
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current" aria-hidden>
            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
          </svg>
          Back to sign in
        </button>

        {!codeSent ? (
          <>
            <div>
              <h2 className="text-lg font-bold text-[#dfe2ee]">Reset your password</h2>
              <p className="text-xs text-[#908fa0] mt-1">
                Enter your email address and we&apos;ll send you a 6-digit verification code.
              </p>
            </div>
            <InputField
              id="reset-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={setResetEmail}
              autoComplete="email"
            />
            {resetStatus && (
              <div className={`text-xs px-3 py-2 rounded-lg ${resetStatus.ok ? "bg-[#61dbb4]/10 text-[#61dbb4] border border-[#61dbb4]/20" : "bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20"}`}>
                {resetStatus.message}
              </div>
            )}
            <motion.button
              type="button"
              disabled={resetLoading || !resetEmail.includes("@")}
              onClick={handleSendResetCode}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-[#07006c] font-semibold text-sm tracking-wide shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {resetLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full inline-block"
                  />
                  Sending Code via Gmail SMTP&hellip;
                </>
              ) : (
                "Send Verification Code"
              )}
            </motion.button>
          </>
        ) : (
          <form onSubmit={handleVerifyReset} className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#dfe2ee]">Enter verification code</h2>
              <p className="text-xs text-[#908fa0] mt-1">
                We sent a 6-digit code to <strong className="text-[#dfe2ee]">{resetEmail}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-otp" className="text-xs font-medium text-[#c7c4d7] tracking-wide uppercase">
                6-Digit Verification Code
              </label>
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={resetOtpCode}
                onChange={(e) => setResetOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                autoFocus
                className="w-full bg-[#0a0e16] border border-[#464554] rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.3em] text-[#dfe2ee] placeholder:text-[#908fa0]/40 focus:outline-none focus:border-[#c0c1ff] focus:ring-2 focus:ring-[#c0c1ff]/20 transition-all duration-200"
              />
            </div>

            <InputField
              id="reset-new-password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
            />

            {resetStatus && (
              <div className={`text-xs px-3 py-2 rounded-lg ${resetStatus.ok ? "bg-[#61dbb4]/10 text-[#61dbb4] border border-[#61dbb4]/20" : "bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20"}`}>
                {resetStatus.message}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={verifyingReset || resetOtpCode.length !== 6}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-[#07006c] font-semibold text-sm tracking-wide shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {verifyingReset ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full inline-block"
                  />
                  Verifying Code&hellip;
                </>
              ) : (
                "Verify Code & Sign In"
              )}
            </motion.button>

            <div className="flex items-center justify-between text-xs text-[#908fa0] pt-1">
              <span>Didn&apos;t get the email?</span>
              <button
                type="button"
                disabled={resetCooldown > 0 || resetLoading}
                onClick={handleSendResetCode}
                className="text-[#c0c1ff] hover:text-[#e1e0ff] disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
              >
                {resetCooldown > 0 ? `Resend in ${resetCooldown}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // ── Normal sign-in view ──
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {loginError && (
        <div className="text-xs px-3 py-2 rounded-lg bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20">
          {loginError}
        </div>
      )}
      <InputField id="signin-email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
      <InputField
        id="signin-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        suffix={
          <button type="button" onClick={() => setShowPassword((p) => !p)} aria-label={showPassword ? "Hide password" : "Show password"} className="hover:text-[#dfe2ee] transition-colors cursor-pointer">
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setForgotMode(true);
            setResetEmail(email);
            setResetStatus(null);
            setCodeSent(false);
          }}
          className="text-xs text-[#c0c1ff] hover:text-[#e1e0ff] transition-colors cursor-pointer"
        >
          Forgot password / Verify with code
        </button>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-[#07006c] font-semibold text-sm tracking-wide shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-4 h-4 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full inline-block"
            />
            Signing in&hellip;
          </>
        ) : (
          "Sign In"
        )}
      </motion.button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#464554]" />
        <span className="text-xs text-[#908fa0]">or continue with</span>
        <div className="flex-1 h-px bg-[#464554]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => handleSocialLogin("Google")} />
        <SocialButton icon={<GitHubIcon />} label="GitHub" onClick={() => handleSocialLogin("GitHub")} />
      </div>

      <p className="text-center text-sm text-[#908fa0] mt-1">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#c0c1ff] hover:text-[#e1e0ff] font-medium transition-colors cursor-pointer">
          Sign up
        </button>
      </p>
    </form>
  );
}

/* ─────────────────────────── SIGN UP FORM ─────────────────────────── */

function SignUpForm({ onSwitch, router }: { onSwitch: () => void; router: ReturnType<typeof useRouter> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // OTP Verification state
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "#ff6b6b", "#ffd166", "#61dbb4"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  // Countdown timer for registration OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Step 1: Submit details -> Send OTP via Gmail SMTP
  const handleRegisterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!agreed || !name || !email || !password) return;
      setLoading(true);
      setSubmitError("");

      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), type: "registration" }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // Transition to OTP verification screen
          setOtpStep(true);
          setResendCooldown(30);
          setOtpError("");
        } else {
          setSubmitError(data.error || "Failed to deliver verification code. Please check your email address.");
        }
      } catch {
        setSubmitError("Network connection error. Please ensure the server is running and try again.");
      } finally {
        setLoading(false);
      }
    },
    [agreed, name, email, password]
  );

  // Step 2: Verify OTP submitted by user
  const handleVerifyOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!otpCode || otpCode.trim().length !== 6) {
        setOtpError("Please enter the 6-digit verification code.");
        return;
      }
      setVerifyingOtp(true);
      setOtpError("");

      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), code: otpCode.trim(), type: "registration" }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // Save authenticated user
          setAuthUser({
            name: name.trim(),
            email: email.trim(),
            loggedInAt: new Date().toISOString(),
          });

          // Send welcome confirmation email in background
          try {
            fetch("/api/email/welcome", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: name.trim(), email: email.trim() }),
            });
          } catch {
            // Non-critical
          }

          router.push("/dashboard");
        } else {
          setOtpError(data.error || "Invalid verification code. Please try again.");
        }
      } catch {
        setOtpError("Verification failed due to a network error. Please try again.");
      } finally {
        setVerifyingOtp(false);
      }
    },
    [email, name, otpCode, router]
  );

  // Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setResendStatus(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), type: "registration" }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResendCooldown(30);
        setResendStatus("A new verification code has been sent to your inbox!");
        setTimeout(() => setResendStatus(null), 5000);
      } else {
        setOtpError(data.error || "Failed to resend code.");
      }
    } catch {
      setOtpError("Failed to resend code. Please check your connection.");
    }
  }, [email, name, resendCooldown]);

  const handleSocialLogin = (provider: "Google" | "GitHub") => {
    setAuthUser({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      loggedInAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  // ── OTP Verification Screen ──
  if (otpStep) {
    return (
      <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            setOtpStep(false);
            setOtpError("");
            setOtpCode("");
          }}
          className="flex items-center gap-1 text-xs text-[#908fa0] hover:text-[#c0c1ff] transition-colors self-start cursor-pointer"
        >
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current" aria-hidden>
            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
          </svg>
          Back to edit details
        </button>

        <div>
          <h2 className="text-xl font-bold text-[#dfe2ee]">Verify your email</h2>
          <p className="text-xs text-[#908fa0] mt-1.5 leading-relaxed">
            We sent a 6-digit verification code to <strong className="text-[#dfe2ee]">{email}</strong> via Gmail SMTP.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-otp" className="text-xs font-medium text-[#c7c4d7] tracking-wide uppercase">
            Verification Code
          </label>
          <input
            id="reg-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            autoFocus
            className="w-full bg-[#0a0e16] border border-[#464554] rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.35em] text-[#dfe2ee] placeholder:text-[#908fa0]/30 focus:outline-none focus:border-[#c0c1ff] focus:ring-2 focus:ring-[#c0c1ff]/20 transition-all duration-200"
          />
        </div>

        {otpError && (
          <div className="text-xs px-3 py-2 rounded-lg bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20">
            {otpError}
          </div>
        )}

        {resendStatus && (
          <div className="text-xs px-3 py-2 rounded-lg bg-[#61dbb4]/10 text-[#61dbb4] border border-[#61dbb4]/20">
            {resendStatus}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={verifyingOtp || otpCode.length !== 6}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-[#07006c] font-semibold text-sm tracking-wide shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {verifyingOtp ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-4 h-4 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full inline-block"
              />
              Activating Account&hellip;
            </>
          ) : (
            "Verify & Complete Registration"
          )}
        </motion.button>

        <div className="flex items-center justify-between text-xs text-[#908fa0] pt-1">
          <span>Didn&apos;t receive the code?</span>
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={handleResendOtp}
            className="text-[#c0c1ff] hover:text-[#e1e0ff] disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
          </button>
        </div>

        <p className="text-center text-[11px] text-[#908fa0]/70 pt-2">
          Tip: Check your spam or promotions folder if you don&apos;t see the email within a few seconds.
        </p>
      </form>
    );
  }

  // ── Registration Form View ──
  return (
    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
      {submitError && (
        <div className="text-xs px-3 py-2 rounded-lg bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20">
          {submitError}
        </div>
      )}

      <InputField id="signup-name" label="Full Name" type="text" placeholder="Jane Doe" value={name} onChange={setName} autoComplete="name" />
      <InputField id="signup-email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />

      {/* Password + strength meter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password" className="text-xs font-medium text-[#c7c4d7] tracking-wide uppercase">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full bg-[#0a0e16] border border-[#464554] rounded-xl px-4 py-3 text-sm text-[#dfe2ee] placeholder:text-[#908fa0] focus:outline-none focus:border-[#c0c1ff] focus:ring-2 focus:ring-[#c0c1ff]/20 transition-all duration-200 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#dfe2ee] transition-colors cursor-pointer"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {password.length > 0 && (
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3].map((lvl) => (
                <motion.div
                  key={lvl}
                  className="h-1 flex-1 rounded-full"
                  animate={{ backgroundColor: strength >= lvl ? strengthColors[strength] : "#464554" }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAgreed((a) => !a)}
          className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            agreed ? "bg-[#8083ff] border-[#8083ff]" : "border-[#464554] group-hover:border-[#908fa0]"
          }`}
        >
          {agreed && (
            <svg viewBox="0 0 12 10" className="w-2.5 h-2.5 fill-none stroke-white" strokeWidth={2}>
              <path d="M1 5l3 3 7-7" />
            </svg>
          )}
        </div>
        <span className="text-xs text-[#908fa0] leading-5">
          I agree to the{" "}
          <button type="button" className="text-[#c0c1ff] hover:text-[#e1e0ff] transition-colors cursor-pointer">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-[#c0c1ff] hover:text-[#e1e0ff] transition-colors cursor-pointer">
            Privacy Policy
          </button>
        </span>
      </label>

      <motion.button
        type="submit"
        disabled={loading || !agreed}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-[#07006c] font-semibold text-sm tracking-wide shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-4 h-4 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full inline-block"
            />
            Sending Verification Code&hellip;
          </>
        ) : (
          "Create Account & Send Code"
        )}
      </motion.button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#464554]" />
        <span className="text-xs text-[#908fa0]">or continue with</span>
        <div className="flex-1 h-px bg-[#464554]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => handleSocialLogin("Google")} />
        <SocialButton icon={<GitHubIcon />} label="GitHub" onClick={() => handleSocialLogin("GitHub")} />
      </div>

      <p className="text-center text-sm text-[#908fa0] mt-1">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#c0c1ff] hover:text-[#e1e0ff] font-medium transition-colors cursor-pointer">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ─────────────────────────── BACKGROUND ORBS ─────────────────────────── */

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(128,131,255,0.18) 0%, rgba(128,131,255,0.06) 50%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(76,215,246,0.14) 0%, rgba(76,215,246,0.05) 50%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-56 h-56 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(97,219,180,0.10) 0%, transparent 70%)", filter: "blur(30px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

/* ─────────────────────────── LOGO MARK ─────────────────────────── */

function LogoMark() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="relative w-9 h-9">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8083ff] via-[#4cd7f6] to-[#61dbb4] opacity-20 blur-sm" />
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#8083ff] to-[#4cd7f6] flex items-center justify-center shadow-lg shadow-[#8083ff]/30">
          <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white" aria-hidden>
            <path d="M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 10 5zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </div>
      </div>
      <span className="text-lg font-bold text-[#dfe2ee] tracking-tight">
        One<span className="text-[#c0c1ff]">Stop</span>
      </span>
    </div>
  );
}

/* ─────────────────────────── MAIN EXPORT ─────────────────────────── */

type Tab = "signin" | "signup";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [existingUser, setExistingUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setExistingUser(getAuthUser());
  }, []);

  const switchToSignUp = useCallback(() => setTab("signup"), []);
  const switchToSignIn = useCallback(() => setTab("signin"), []);

  return (
    <div className="min-h-screen bg-[#0f131c] flex items-center justify-center p-4 relative">
      <BackgroundOrbs />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#c0c1ff 1px, transparent 1px), linear-gradient(90deg, #c0c1ff 1px, transparent 1px)", backgroundSize: "48px 48px" }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="relative rounded-2xl border border-[#464554]/60 bg-[#0f131c]/80 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8083ff]/60 to-transparent" />

          <div className="p-8">
            <LogoMark />

            {existingUser && (
              <div className="mb-5 p-3 rounded-xl bg-[#8083ff]/10 border border-[#8083ff]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8083ff] to-[#4cd7f6] flex items-center justify-center font-bold text-[10px] text-[#07006c] shrink-0">
                    {existingUser.name ? existingUser.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-[#dfe2ee] truncate">
                    Logged in: <strong className="text-white">{existingUser.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-2.5 py-1 rounded-lg bg-[#8083ff] hover:bg-[#c0c1ff] text-[#07006c] font-semibold transition-colors cursor-pointer"
                  >
                    Enter →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthUser();
                      setExistingUser(null);
                    }}
                    className="text-[#908fa0] hover:text-[#ff6b6b] transition-colors cursor-pointer px-1 py-1"
                    title="Switch account"
                  >
                    Switch
                  </button>
                </div>
              </div>
            )}

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-[#0a0e16] p-1 mb-6 border border-[#464554]/50">
              {(["signin", "signup"] as Tab[]).map((t) => (
                <button
                  key={t}
                  id={`tab-${t}`}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    tab === t ? "text-[#dfe2ee]" : "text-[#908fa0] hover:text-[#c7c4d7]"
                  }`}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg bg-[#1c2028] border border-[#464554]/60"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t === "signin" ? "Sign In" : "Sign Up"}</span>
                </button>
              ))}
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab + "-heading"}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-2xl font-bold text-[#dfe2ee] tracking-tight">
                  {tab === "signin" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-sm text-[#908fa0] mt-1">
                  {tab === "signin"
                    ? "Access 5 frontier AI models in one place."
                    : "Join OneStop and compare AI models instantly."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {tab === "signin" ? (
                <motion.div
                  key="signin-form"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <SignInForm onSwitch={switchToSignUp} router={router} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <SignUpForm onSwitch={switchToSignIn} router={router} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4cd7f6]/40 to-transparent" />
        </div>

        <p className="text-center text-xs text-[#464554] mt-5">
          Protected by reCAPTCHA &nbsp;&middot;&nbsp; OneStop AI Platform
        </p>
      </motion.div>
    </div>
  );
}
