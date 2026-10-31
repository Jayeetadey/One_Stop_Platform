import { generateOtp, verifyOtp, canResendOtp } from "../lib/otp.ts";
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from "../lib/session.ts";

async function runUnitTests() {
  console.log("=== 1. TEST: OTP Generation & Hashing ===");
  const testEmail = "unit-test-user@example.com";
  const { code, expiresAt, resendAvailableAt } = generateOtp(testEmail, "login", { name: "Test User" });

  console.log(`Generated 6-digit code: ${code.length === 6 && /^\d+$/.test(code) ? "VALID 6-DIGIT" : "INVALID"}`);
  console.log(`Expires in: ${Math.round((expiresAt - Date.now()) / 60000)} minutes`);

  // Check resend cooldown
  const cooldownCheck = canResendOtp(testEmail, "login");
  console.log(`Resend allowed immediately? ${cooldownCheck.allowed} (expected false, waitSeconds: ${cooldownCheck.waitSeconds})`);
  if (cooldownCheck.allowed) throw new Error("Cooldown should not be allowed immediately!");

  console.log("\n=== 2. TEST: Incorrect OTP Attempt ===");
  const badVerify = verifyOtp(testEmail, "000000", "login");
  console.log(`Bad verification valid? ${badVerify.valid} (expected false)`);
  console.log(`Bad verification error: ${badVerify.error}`);
  if (badVerify.valid) throw new Error("Bad code should not be valid!");

  console.log("\n=== 3. TEST: Correct OTP Verification & Burn ===");
  const goodVerify = verifyOtp(testEmail, code, "login");
  console.log(`Good verification valid? ${goodVerify.valid} (expected true)`);
  console.log(`Metadata name: ${goodVerify.metadata?.name}`);
  if (!goodVerify.valid) throw new Error("Good code should be valid!");

  console.log("\n=== 4. TEST: Reused OTP (Single-Use Guard) ===");
  const reuseVerify = verifyOtp(testEmail, code, "login");
  console.log(`Reuse verification valid? ${reuseVerify.valid} (expected false)`);
  console.log(`Reuse error: ${reuseVerify.error}`);
  if (reuseVerify.valid) throw new Error("OTP was reused! Burn failed!");

  console.log("\n=== 5. TEST: Signed Session Token & Tamper Resistance ===");
  const token = createSessionToken(testEmail, "Test User");
  console.log(`Token created: ${token.slice(0, 30)}...`);

  const validVerification = verifySessionToken(token);
  console.log(`Token verification: valid=${validVerification.valid}, user=${validVerification.user?.email}`);
  if (!validVerification.valid || validVerification.user?.email !== testEmail) {
    throw new Error("Valid token failed verification!");
  }

  // Tamper with payload
  const [b64, sig] = token.split(".");
  const tamperedToken = `${b64}x.${sig}`;
  const tamperedVerification = verifySessionToken(tamperedToken);
  console.log(`Tampered token valid? ${tamperedVerification.valid} (expected false)`);
  if (tamperedVerification.valid) throw new Error("Tampered token was accepted!");

  console.log("\n=== ALL UNIT TESTS PASSED ===");
}

runUnitTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
