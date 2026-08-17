/*
 * Organiser authentication for /admin.
 *
 * Model: one shared organiser passcode (ADMIN_SECRET env var). A correct
 * passcode sets an HTTP-only cookie holding an HMAC token derived from the
 * secret, so rotating the secret invalidates every session. Web Crypto only,
 * so the same code runs in middleware (edge) and route handlers (node).
 */

export const ADMIN_COOKIE = "bs_admin";
const TOKEN_PAYLOAD = "beyond-syllabus-admin-v1";

function getSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison over equal-length hex digests. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function sessionTokenFor(secret: string): Promise<string> {
  return hmacHex(secret, TOKEN_PAYLOAD);
}

/** Compare a submitted passcode against ADMIN_SECRET without leaking timing. */
export async function passcodeIsValid(submitted: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  // Compare HMACs of both values under a fixed key so lengths are equal.
  const [a, b] = await Promise.all([hmacHex(TOKEN_PAYLOAD, submitted), hmacHex(TOKEN_PAYLOAD, secret)]);
  return timingSafeEqualHex(a, b);
}

export async function sessionIsValid(cookieValue: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !cookieValue) return false;
  const expected = await sessionTokenFor(secret);
  return timingSafeEqualHex(cookieValue, expected);
}

/**
 * CSRF guard for mutating admin endpoints: the session cookie is SameSite=Lax,
 * and we additionally require a matching Origin header.
 */
export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin non-CORS requests may omit it
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
