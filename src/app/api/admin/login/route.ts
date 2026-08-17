import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, originAllowed, passcodeIsValid, sessionTokenFor } from "@/lib/admin-auth";

/*
 * Login: passcode in, HTTP-only session cookie out.
 * Rate limited per IP. In-memory state resets on cold start, which is an
 * acceptable bound for a small organiser team.
 */

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function limited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts — try again in 15 minutes." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as { passcode?: string } | null;
  if (!body?.passcode || !(await passcodeIsValid(body.passcode))) {
    return NextResponse.json({ error: "That passcode isn't right." }, { status: 401 });
  }

  const secret = process.env.ADMIN_SECRET as string;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await sessionTokenFor(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
