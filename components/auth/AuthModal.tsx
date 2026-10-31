"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setAuthUser } from "@/lib/auth";

/* ─────────────────────────── SVG ICONS ─────────────────────────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
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
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 fill-current" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none" strokeWidth={2} aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={2} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none" strokeWidth={2.5} aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ─────────────────────────── PROPS ─────────────────────────── */

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullPage?: boolean;
}

export default function AuthModal({ isOpen, onClose, fullPage = false }: AuthModalProps) {
  const router = useRouter();

  // Step state: 'email' | 'otp'
  const [step, setStep] = useState<"email" | "otp">("email");

  // Step 1: Email Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Step 2: 6-Digit OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  // Refs for 6 individual input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input when switching to 'otp' step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen || fullPage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, fullPage]);

  // Email format validator
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // ── Step 1: Send OTP via Server & Gmail SMTP ──
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setEmailError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    setEmailError("");
    setIsSending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: name.trim() || cleanEmail.split("@")[0],
          type: "login",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep("otp");
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
        setResendCooldown(30);
        setResendMessage("");
      } else {
        setEmailError(data.error || "Failed to send verification code. Please try again.");
      }
    } catch {
      setEmailError("Network error. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  // ── Step 2: Handle Individual Digit Inputs ──
  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setOtpError("");

    // Auto-advance focus to next input if digit entered
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are filled
    const fullCode = newDigits.join("");
    if (fullCode.length === 6 && !newDigits.includes("")) {
      executeVerification(fullCode);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // Move back to previous box and clear it
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ── Paste Full 6-Digit Code ──
  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    setOtpError("");

    // Focus appropriate box
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();

    // If complete 6-digit code was pasted, verify immediately
    if (pasted.length === 6) {
      executeVerification(pasted);
    }
  };

  // ── Verify Code on Server ──
  const executeVerification = useCallback(
    async (codeToVerify: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      setOtpError("");

      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            code: codeToVerify,
            name: name.trim() || email.trim().split("@")[0],
            type: "login",
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setOtpSuccess(true);
          // Store user profile for immediate client-side reactive rendering
          setAuthUser({
            name: data.user?.name || email.trim().split("@")[0],
            email: email.trim(),
            loggedInAt: new Date().toISOString(),
          });

          // Wait brief moment so user sees success feedback, then redirect
          setTimeout(() => {
            onClose();
            router.push("/dashboard");
          }, 700);
        } else {
          setOtpError(data.error || "Incorrect verification code. Please try again.");
          // Clear inputs on failed attempt for fast retry
          setOtpDigits(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } catch {
        setOtpError("Network error. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [email, name, isVerifying, onClose, router]
  );

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits of your verification code.");
      return;
    }
    executeVerification(code);
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    if (resendCooldown > 0 || isSending) return;
    setIsSending(true);
    setOtpError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || email.trim().split("@")[0],
          type: "login",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResendCooldown(30);
        setResendMessage("A new 6-digit code was sent to your inbox!");
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setOtpError(data.error || "Failed to resend code.");
      }
    } catch {
      setOtpError("Network error. Could not resend code.");
    } finally {
      setIsSending(false);
    }
  };

  // Social sign in simulation
  const handleSocialSignIn = (provider: "Google" | "GitHub") => {
    setAuthUser({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      loggedInAt: new Date().toISOString(),
    });
    onClose();
    router.push("/dashboard");
  };

  if (!isOpen && !fullPage) return null;

  const content = (
    <div className="relative w-full max-w-md bg-[#11151f] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
      {/* Header with Close button (if modal) */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8083ff] text-[#07006c] font-bold text-xs flex items-center justify-center font-mono">
            1S
          </div>
          <span className="font-semibold text-sm text-white">OneStop</span>
        </div>

        {!fullPage && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === "email" ? (
          /* ── STEP 1: ENTER EMAIL ── */
          <motion.div
            key="step-email"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4 pt-2"
          >
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Sign in with email
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your email address to receive a 6-digit verification code.
              </p>
            </div>

            {emailError && (
              <div className="text-xs px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {emailError}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="auth-email-input"
                  className="text-xs font-medium text-zinc-300"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="auth-email-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    disabled={isSending}
                    className="w-full bg-[#090c13] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8083ff] transition-all pl-9"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <MailIcon />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="auth-name-input"
                  className="text-xs font-medium text-zinc-300 flex items-center justify-between"
                >
                  <span>Name</span>
                  <span className="text-[11px] text-zinc-500 font-normal">optional</span>
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSending}
                  className="w-full bg-[#090c13] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8083ff] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || !email.trim()}
                className="w-full mt-1 py-2.5 rounded-xl bg-[#8083ff] hover:bg-[#9295ff] text-[#07006c] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSending ? "Sending code via email..." : "Continue with email"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[11px] text-zinc-500">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialSignIn("Google")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-zinc-200 transition-all cursor-pointer"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("GitHub")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-zinc-200 transition-all cursor-pointer"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── STEP 2: ENTER 6-DIGIT OTP ── */
          <motion.div
            key="step-otp"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4 pt-2"
          >
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtpDigits(["", "", "", "", "", ""]);
                  setOtpError("");
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors mb-2 cursor-pointer block"
              >
                ← Back to email
              </button>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Check your inbox
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                We sent a 6-digit code to <strong className="text-zinc-200">{email}</strong>. It expires in 5 minutes.
              </p>
            </div>

            {otpError && (
              <div className="text-xs px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {otpError}
              </div>
            )}

            {resendMessage && (
              <div className="text-xs px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {resendMessage}
              </div>
            )}

            {otpSuccess ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <span className="text-emerald-400 font-semibold text-sm">✓ Code verified</span>
                <span className="text-xs text-zinc-400">Opening your workspace...</span>
              </div>
            ) : (
              <form onSubmit={handleManualVerify} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      id={`otp-box-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      onPaste={handleDigitPaste}
                      disabled={isVerifying}
                      aria-label={`Digit ${idx + 1}`}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-semibold rounded-xl bg-[#090c13] border transition-all focus:outline-none ${
                        digit
                          ? "border-[#8083ff] text-white"
                          : "border-white/[0.1] text-zinc-300 focus:border-[#8083ff]"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join("").length !== 6}
                  className="w-full py-2.5 rounded-xl bg-[#8083ff] hover:bg-[#9295ff] text-[#07006c] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  {isVerifying ? "Verifying..." : "Verify code"}
                </button>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span>Didn&apos;t get the email?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isSending}
                    onClick={handleResend}
                    className="text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-[#090c13] flex items-center justify-center px-4 py-12">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md flex items-center justify-center"
      >
        {content}
      </motion.div>
    </div>
  );
}
