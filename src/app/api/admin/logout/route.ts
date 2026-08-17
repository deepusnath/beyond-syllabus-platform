import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, originAllowed } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
