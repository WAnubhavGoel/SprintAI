import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Routes that require the user to be signed in
const PROTECTED = ['/dashboard', '/notes'];
// Routes that logged-in users should not visit
const AUTH_PAGES = ['/signin', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // If already logged in and trying to visit signin/signup, redirect to dashboard
  const isAuthPage = AUTH_PAGES.some((path) => pathname.startsWith(path));
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected routes without a session, redirect to signin
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on protected and auth paths only
  matcher: ['/dashboard/:path*', '/notes/:path*', '/signin', '/signup'],
};
