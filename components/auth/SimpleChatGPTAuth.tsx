"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { setAuthUser } from "@/lib/auth";

interface SimpleChatGPTAuthProps {
  onSuccess?: () => void;
}

export default function SimpleChatGPTAuth({ onSuccess }: SimpleChatGPTAuthProps) {
  // Step: 'email' | 'otp'
  const [step, setStep] = useState<"email" | "otp">("email");

  // Step 1: Email Form
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Step 2: 6-Box OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus box 0 on step switch
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 80);
    }
  }, [step]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Send OTP via Gmail SMTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError("Enter your email address.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setEmailError("Enter a valid email address (e.g. name@example.com).");
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
          name: cleanEmail.split("@")[0],
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
        setEmailError(data.error || "Failed to send verification code. Try again.");
      }
    } catch {
      setEmailError("Network connection error. Check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  // 6-box input handlers
  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);
    setOtpError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = updated.join("");
    if (fullCode.length === 6 && !updated.includes("")) {
      executeVerification(fullCode);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        const updated = [...otpDigits];
        updated[index - 1] = "";
        setOtpDigits(updated);
        inputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otpDigits];
        updated[index] = "";
        setOtpDigits(updated);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i];
    setOtpDigits(updated);
    setOtpError("");

    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();

    if (pasted.length === 6) {
      executeVerification(pasted);
    }
  };

  // Verify OTP
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
            name: email.trim().split("@")[0],
            type: "login",
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setOtpSuccess(true);
          setAuthUser({
            name: data.user?.name || email.trim().split("@")[0],
            email: email.trim(),
            loggedInAt: new Date().toISOString(),
          });

          setTimeout(() => {
            if (onSuccess) onSuccess();
            else window.location.href = "/";
          }, 400);
        } else {
          setOtpError(data.error || "Incorrect verification code. Please try again.");
          setOtpDigits(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } catch {
        setOtpError("Network error. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [email, isVerifying, onSuccess]
  );

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setOtpError("Enter all 6 digits.");
      return;
    }
    executeVerification(code);
  };

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
          name: email.trim().split("@")[0],
          type: "login",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResendCooldown(30);
        setResendMessage("A new code was sent to your email.");
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setOtpError(data.error || "Could not resend code.");
      }
    } catch {
      setOtpError("Network error.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSocialSignIn = (provider: "Google" | "GitHub") => {
    setAuthUser({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      loggedInAt: new Date().toISOString(),
    });
    if (onSuccess) onSuccess();
    else window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-white flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      {/* Top brand */}
      <div className="w-full max-w-sm flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8083ff] text-[#07006c] font-black text-xs flex items-center justify-center font-mono">
            1S
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">OneStop</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-[380px] my-auto py-8">
        {step === "email" ? (
          /* ── STEP 1: ENTER EMAIL ── */
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                Welcome to OneStop
              </h1>
              <p className="text-sm text-zinc-400">
                Log in or sign up to compare AI models side by side.
              </p>
            </div>

            {emailError && (
              <div className="text-xs px-3.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-center">
                {emailError}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
              <input
                id="simple-auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                disabled={isSending}
                className="w-full bg-[#161a26] border border-white/[0.12] focus:border-[#8083ff] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={isSending || !email.trim()}
                className="w-full py-3 rounded-xl bg-[#8083ff] hover:bg-[#9295ff] text-[#07006c] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.99]"
              >
                {isSending ? "Sending code..." : "Continue with email"}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialSignIn("Google")}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/[0.1] bg-[#161a26] hover:bg-[#1e2333] text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn("GitHub")}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/[0.1] bg-[#161a26] hover:bg-[#1e2333] text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-current text-white" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── STEP 2: 6-DIGIT OTP ── */
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtpDigits(["", "", "", "", "", ""]);
                  setOtpError("");
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors mb-3 inline-block cursor-pointer"
              >
                ← Use a different email
              </button>
              <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                Check your inbox
              </h1>
              <p className="text-xs text-zinc-400">
                We sent a 6-digit code to <strong className="text-zinc-200">{email}</strong>.
              </p>
            </div>

            {otpError && (
              <div className="text-xs px-3.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-center">
                {otpError}
              </div>
            )}

            {resendMessage && (
              <div className="text-xs px-3.5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-center">
                {resendMessage}
              </div>
            )}

            {otpSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <span className="text-emerald-400 font-semibold text-sm">✓ Code verified</span>
                <span className="text-xs text-zinc-400">Opening chat...</span>
              </div>
            ) : (
              <form onSubmit={handleManualVerify} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      id={`chatgpt-otp-${idx}`}
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
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-semibold rounded-xl bg-[#161a26] border transition-colors focus:outline-none ${
                        digit
                          ? "border-[#8083ff] text-white"
                          : "border-white/[0.12] text-zinc-300 focus:border-[#8083ff]"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join("").length !== 6}
                  className="w-full py-3 rounded-xl bg-[#8083ff] hover:bg-[#9295ff] text-[#07006c] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm mt-1"
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
          </div>
        )}
      </div>

      {/* Clean Bottom Note */}
      <div className="w-full max-w-sm text-center text-[11px] text-zinc-500 pb-2">
        <span>By continuing, you agree to OneStop&apos;s Terms & Privacy.</span>
      </div>
    </div>
  );
}
