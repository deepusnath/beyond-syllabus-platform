import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionIsValid } from "@/lib/admin-auth";

/* Every /admin and /api/admin path requires an organiser session, except
 * the login page and login endpoint themselves. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isLogin) return NextResponse.next();

  const ok = await sessionIsValid(request.cookies.get(ADMIN_COOKIE)?.value);
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
