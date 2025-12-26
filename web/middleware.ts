import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/'];
  const isPublicPath = publicPaths.includes(pathname);

  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/inventory', '/purchases', '/image-recognition'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Check for NextAuth session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check for custom auth tokens in cookies (as fallback)
  const accessToken = request.cookies.get('accessToken')?.value;

  const isAuthenticated = !!(token || accessToken);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to signin
  if (!isAuthenticated && isProtectedPath) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts).*)',
  ],
};
