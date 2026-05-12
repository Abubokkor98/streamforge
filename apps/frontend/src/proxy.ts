import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REFRESH_TOKEN_COOKIE = "refreshToken"
const LOGIN_PATH = "/login"

/**
 * Optimistic auth guard — checks for the existence of the refresh token cookie.
 *
 * This is NOT the security boundary. The actual token validation happens
 * in the API client (backend verifies JWT + refresh token on every request).
 * This proxy only prevents unauthenticated users from seeing protected
 * page shells before the client-side redirect kicks in.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE)

  if (!hasSession) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/host/:path*"],
}
