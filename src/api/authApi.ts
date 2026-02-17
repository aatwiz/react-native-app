/**
 * Auth API — custom authentication flow.
 *
 * Talks to the Express mock server. Falls back to inline mocks
 * if the server is unreachable (offline development).
 */

const API_BASE = "http://localhost:3000";

/** Helper: fetch with fallback */
async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  fallback?: () => Promise<T>
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    if (fallback) return fallback();
    throw new Error("Server unreachable and no fallback provided");
  }
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Verify email exists                                      */
/* ------------------------------------------------------------------ */
export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  exists: boolean;
  /** Optional message when email is not found */
  message?: string;
}

/**
 * POST /auth/verify-email
 * Checks whether the given email exists in AIP Genius's user database.
 */
export async function verifyEmail(
  email: string
): Promise<VerifyEmailResponse> {
  return apiFetch<VerifyEmailResponse>(
    `${API_BASE}/auth/verify-email`,
    { method: "POST", body: JSON.stringify({ email }) },
    async () => {
      await new Promise((r) => setTimeout(r, 800));
      return { exists: true };
    }
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Submit OTP / authenticator code                          */
/* ------------------------------------------------------------------ */
export interface SubmitOtpRequest {
  email: string;
  code: string;
}

export interface SubmitOtpResponse {
  success: boolean;
  /** Error detail when code is wrong */
  message?: string;
}

/**
 * POST /auth/verify-otp
 * Validates the TOTP / authenticator code for the given email.
 * On success, triggers the backend to send a magic-link email.
 */
export async function submitOtp(
  email: string,
  code: string
): Promise<SubmitOtpResponse> {
  return apiFetch<SubmitOtpResponse>(
    `${API_BASE}/auth/verify-otp`,
    { method: "POST", body: JSON.stringify({ email, code }) },
    async () => {
      await new Promise((r) => setTimeout(r, 1000));
      if (code.length === 6) {
        return { success: true };
      }
      return { success: false, message: "Invalid code. Please try again." };
    }
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Check magic-link status (polling)                        */
/* ------------------------------------------------------------------ */
export interface MagicLinkStatusRequest {
  email: string;
  /** A session/nonce the backend returns after OTP success */
  sessionId: string;
}

export interface MagicLinkStatusResponse {
  /** "pending" while waiting for click, "authenticated" once clicked */
  status: "pending" | "authenticated";
  /** Tokens issued after the user clicks the magic link */
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
}

/**
 * GET /auth/magic-link-status?email=...&sessionId=...
 * Polls whether the user has clicked the magic-link email.
 * Once status === "authenticated", tokens are returned.
 */
export async function checkMagicLinkStatus(
  email: string,
  sessionId: string
): Promise<MagicLinkStatusResponse> {
  return apiFetch<MagicLinkStatusResponse>(
    `${API_BASE}/auth/magic-link-status?email=${encodeURIComponent(email)}&sessionId=${sessionId}`,
    { method: "GET" },
    async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return { status: "pending" };
    }
  );
}
