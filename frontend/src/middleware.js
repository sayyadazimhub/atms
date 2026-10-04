import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';
import serverApiUrl from '@/lib/server-api-url';

function isAdminRoute(pathname) {
  return pathname.startsWith('/');
}

function isAdminPublic(pathname) {
  if (pathname === '/') return true;
  if (pathname.startsWith('/contact')) return true;
  if (pathname === '/login' || pathname.startsWith('/login/')) return true;
  if (pathname === '/register' || pathname.startsWith('/register/')) return true;
  if (pathname.startsWith('/forgot-password')) return true;
  if (pathname.startsWith('/reset-password')) return true;
  if (pathname === '/favicon.svg' || pathname === '/favicon.ico') return true;
  return false;
}

function isUserRoute(pathname) {
  return pathname.startsWith('/user');
}

function isUserPublic(pathname) {
  if (pathname === '/user' || pathname === '/portal/') return true;
  if (pathname === '/portal/register' || pathname.startsWith('/portal/register/')) return true;
  if (pathname === '/portal/login' || pathname.startsWith('/portal/login/')) return true;
  if (pathname.startsWith('/portal/forgot-password')) return true;
  if (pathname.startsWith('/portal/reset-password')) return true;
  if (pathname.startsWith('/portal/verify-otp')) return true;
  return false;
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // ——— User routes (separate UI/API, jose token) ———
  if (isUserRoute(pathname)) {
    // Check system settings
    let settings = { maintenanceMode: false, traderSelfRegistration: true };
    try {
      const res = await fetch(`${serverApiUrl}/api/settings/public`, {
          next: { revalidate: 60 }
      });
      if (res.ok) settings = await res.json();
    } catch (e) {
      console.error('Settings fetch error in middleware:', e);
    }

    if (settings.maintenanceMode) {
      if (pathname !== '/portal/logout') {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }

    if (!settings.traderSelfRegistration && pathname.startsWith('/portal/register')) {
      const loginUrl = new URL('/portal/login', request.url);
      loginUrl.searchParams.set('error', 'registration_disabled');
      return NextResponse.redirect(loginUrl);
    }

    const userToken = request.cookies.get('user-token')?.value;
    if (isUserPublic(pathname)) {
      if (userToken) {
        const decoded = await verifyUserToken(userToken);
        if (decoded && (pathname === '/portal/login' || pathname === '/portal/register' || pathname === '/portal/verify-otp')) {
          return NextResponse.redirect(new URL('/portal/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }
    if (!userToken) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    const decoded = await verifyUserToken(userToken);
    if (!decoded) {
      const res = NextResponse.redirect(new URL('/portal/login', request.url));
      res.cookies.delete('user-token');
      return res;
    }
    return NextResponse.next();
  }

  // ——— Admin routes (existing auth-token, jwt-edge verify) ———
  if (isAdminRoute(pathname)) {
    const token = request.cookies.get('auth-token')?.value;
    if (isAdminPublic(pathname)) {
      if (token) {
        const decoded = await verifyUserToken(token);
        if (decoded && (pathname === '/login' || pathname === '/register')) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const decoded = await verifyUserToken(token);
    if (!decoded) {
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
