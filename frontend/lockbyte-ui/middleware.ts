import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminCookie = request.cookies.get('isAdmin');
  const isLoginPage = pathname.startsWith('/login');

  // Check if the user is an admin based on the cookie
  const userIsAdmin = isAdminCookie?.value === 'true';

  // If user is an admin and tries to access the login page, redirect to the dashboard
  if (userIsAdmin && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If the route is an admin route and the user is not an admin, redirect to login
  if (pathname.startsWith('/admin') && !userIsAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Match all admin routes and the login page to handle both redirect cases
  matcher: ['/admin/:path*', '/login', '/profile'],
};