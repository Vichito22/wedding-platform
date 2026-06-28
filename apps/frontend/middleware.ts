import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const hasSessionCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME));
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/login") && hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
