import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const superadminOnlyRoutes = ['/createuser', '/customapi', '/settings', '/usersettings'];

function isAdminRoute(url: string): boolean {
  return url.startsWith('/admin');
}

function isSuperAdminOnlyRoute(url: string): boolean {
  return superadminOnlyRoutes.some(route => url.endsWith(route));
}

// i18n middleware instance
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false, // 👈 this disables auto-redirect based on Accept-Language
});

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  //Reroute /products to /drivers
  if (url.pathname === '/en/products' || url.pathname === '/en/produk') {
    return NextResponse.redirect(new URL('/en/drivers', req.url), 301);
  }
  if (url.pathname === '/produk' || url.pathname === '/products') {
    return NextResponse.redirect(new URL('/driver', req.url), 301);
  }

  // Handle Admin Routes
  if (isAdminRoute(url.pathname)) {
    const session = req.cookies.get('loginSession');

    if (url.pathname === '/admin/sign-in' || url.pathname === '/admin/api/user/login') {
      if (!session) return NextResponse.next();
      return NextResponse.redirect(new URL('/admin/', req.url));
    }

    if (!session) {
      return NextResponse.redirect(new URL('/admin/sign-in', req.url));
    }

    if (isSuperAdminOnlyRoute(url.pathname)) {
      if (session) return NextResponse.next();
      return NextResponse.redirect(new URL('/admin/', req.url));
    }

    return NextResponse.next();
  }
  
  if(url.pathname.startsWith('/_next') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Apply next-intl middleware for non-admin UI routes
  return intlMiddleware(req);
}

// Unified matcher (covers both i18n and admin routes)
export const config = {
  matcher: ['/((?!.*\\..*|_next|_vercel).*)'],
};
