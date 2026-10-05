import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';
import serverApiUrl from '@/lib/server-api-url';


function isPortalRoute(pathname) {
  return pathname.startsWith('/portal');
}

function isPublicPortalRoute(pathname) {
  if (pathname === '/portal/register' || pathname.startsWith('/portal/register/')) return true;
  if (pathname === '/portal/login' || pathname.startsWith('/portal/login/')) return true;
  if (pathname.startsWith('/portal/forgot-password')) return true;
  if (pathname.startsWith('/portal/reset-password')) return true;
  if (pathname.startsWith('/portal/verify-otp')) return true;
  return false;
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // ——— Portal routes (separate UI/API, jose token) ———
  if (isPortalRoute(pathname)) {
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

    const sessionToken = request.cookies.get('user-token')?.value;
    if (isPublicPortalRoute(pathname)) {
      if (sessionToken) {
        const decodedToken = await verifyUserToken(sessionToken);
        if (decodedToken && (pathname === '/portal/login' || pathname === '/portal/register' || pathname === '/portal/verify-otp')) {
          return NextResponse.redirect(new URL('/portal/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    
    const decodedToken = await verifyUserToken(sessionToken);
    if (!decodedToken) {
      const res = NextResponse.redirect(new URL('/portal/login', request.url));
      res.cookies.delete('user-token');
      return res;
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)'],
};
