// Client-side authentication helpers with HttpOnly session integration.
// Secure HttpOnly SameSite cookies guard all private routes on the server,
// while local state provides immediate reactive rendering for user avatar and display name.

export interface AuthUser {
  name: string;
  email: string;
  avatar?: string;
  loggedInAt: string;
}

const AUTH_KEY = "onestop_auth_user";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}

/**
 * Validates the session with the server and syncs local user profile.
 */
export async function syncSession(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const data = await res.json();
    if (data.authenticated && data.user) {
      const user: AuthUser = {
        name: data.user.name,
        email: data.user.email,
        loggedInAt: new Date().toISOString(),
      };
      setAuthUser(user);
      return user;
    } else {
      clearAuthUser();
      return null;
    }
  } catch {
    return getAuthUser();
  }
}

/**
 * Signs the user out by clearing the server HttpOnly session cookie and local state.
 */
export async function performLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Best effort on network failure
  }
  clearAuthUser();
}
