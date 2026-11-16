import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

// GET /api/auth/session
// Inspects HttpOnly onestop_session cookie and returns current authenticated user.
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  const verification = verifySessionToken(token);

  if (!verification.valid || !verification.user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: verification.user,
  });
}

// POST /api/auth/session
// Establishes a server session for authenticated clients (e.g. Firebase Phone Auth).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { uid, email, phoneNumber, name } = body as {
      uid?: string;
      email?: string;
      phoneNumber?: string;
      name?: string;
    };

    const identifier = (email || phoneNumber || "").trim();
    if (!identifier && !uid) {
      return NextResponse.json(
        { success: false, error: "A valid email, phone number, or UID is required." },
        { status: 400 }
      );
    }

    const safeEmail = (email || `${phoneNumber || uid}@phone.onestop.ai`).trim().toLowerCase();
    const safeName = (name || safeEmail.split("@")[0] || "User").trim().slice(0, 100);
    const safeUid = (uid || "").trim();

    const token = createSessionToken(safeEmail, safeName, safeUid || undefined);

    const verification = verifySessionToken(token);
    if (!verification.valid || !verification.user) {
      return NextResponse.json(
        { success: false, error: "Failed to create session token." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: verification.user,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err: unknown) {
    console.error("[POST /api/auth/session Error]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "Failed to establish session." },
      { status: 500 }
    );
  }
}
