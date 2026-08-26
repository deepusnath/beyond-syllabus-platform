import { NextRequest, NextResponse } from "next/server";
import { saveSubmission, type SubmissionRecord } from "@/lib/submissions";

/*
 * Public participation endpoint. Each valid submission becomes one commit
 * on the `submissions` branch (never main, so no deploys from form
 * traffic). Defences, in order: honeypot field, per-IP rate limit,
 * strict field length caps. The record stores only what was typed.
 */

// Generous per-IP budget: whole campuses share one NAT IP during live
// sessions, so this only has to stop mindless flooding, not people.
const LIMIT = 60;
const WINDOW_MS = 10 * 60 * 1000;
// Per-instance memory: resets on cold start, which is acceptable — this is
// a speed bump against casual flooding, not a hard quota.
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function text(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, max);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see this field. Pretend success.
  if (text(body.website, 100)) return NextResponse.json({ ok: true });

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  const form = body.form === "voice" ? "voice" : body.form === "participate" ? "participate" : null;
  const name = text(body.name, 120);
  const email = text(body.email, 254);
  if (!form || !name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  const record: SubmissionRecord = {
    receivedAt: new Date().toISOString(),
    form,
    name,
    email,
    organisation: text(body.organisation, 200),
    stakeholder: text(body.stakeholder, 40),
  };

  if (form === "participate") {
    record.action = text(body.action, 60);
    record.message = text(body.message, 6000);
  } else {
    const answers = Array.isArray(body.answers) ? body.answers.slice(0, 3) : [];
    record.answers = answers.map((a) => text(a, 2000));
    if (!record.answers.some(Boolean)) {
      return NextResponse.json({ error: "Answer at least one question." }, { status: 400 });
    }
    record.videoUrl = text(body.videoUrl, 500);
  }

  try {
    await saveSubmission(record);
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Surface the cause in the function logs; the client falls back to
    // the mailto handoff on any failure.
    console.error("participate: could not record submission:", error);
    return NextResponse.json({ error: "Could not record the submission." }, { status: 500 });
  }
}
