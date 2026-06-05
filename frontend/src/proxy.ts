import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard'];
const adminPaths = ['/dashboard/admin'];
const employerPaths = ['/dashboard/employer'];
const seekerPaths = ['/dashboard/seeker'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role: string = payload.role;

      if (adminPaths.some((p) => pathname.startsWith(p)) && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (
        employerPaths.some((p) => pathname.startsWith(p)) &&
        role !== 'EMPLOYER'
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (
        seekerPaths.some((p) => pathname.startsWith(p)) &&
        role !== 'JOB_SEEKER'
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
