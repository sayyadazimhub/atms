import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';

function isAdminPath(pathname) {
  return pathname.startsWith('/');
}

function isPublicAdminPath(pathname) {
  if (pathname === '/') return true;
  if (pathname === '/login' || pathname.startsWith('/login/')) return true;
  if (pathname.startsWith('/forgot-password')) return true;
  if (pathname.startsWith('/reset-password')) return true;
  if (pathname === '/favicon.svg' || pathname === '/favicon.ico') return true;
  return false;
}



export async function middleware(request) {
  const pathname = request.nextUrl.pathname;


  // ——— Admin paths (existing auth-token, jwt-edge verify) ———
  if (isAdminPath(pathname)) {
    const sessionToken = request.cookies.get('auth-token')?.value;
    
    if (isPublicAdminPath(pathname)) {
      if (sessionToken) {
        const decodedToken = await verifyUserToken(sessionToken);
        if (decodedToken && (pathname === '/login' || pathname === '/register')) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const decodedToken = await verifyUserToken(sessionToken);
    if (!decodedToken) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('auth-token');
      return res;
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)'],
};
