import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "portofolio-admin-session-secret-change-me";

/**
 * Proteksi /admin berbasis cookie sesi (bukan Supabase Auth).
 * Next.js 16: middleware bernama proxy.ts.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token !== SESSION_SECRET) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
