import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Exclude API routes, static files, and Next.js internal paths from logging
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/robots.txt')
  ) {
    return NextResponse.next();
  }
 
   console.log(`Middleware: Logging URL visit for ${pathname}`);
   try {
     const response = await fetch('http://localhost:3000/api/log', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         type: 'URL VISIT',
         message: `Visited URL: ${pathname}`,
       }),
     });
     if (!response.ok) {
       console.error(`Middleware: Failed to log URL visit. Status: ${response.status}`);
     } else {
       console.log(`Middleware: Successfully logged URL visit for ${pathname}`);
     }
   } catch (error) {
     console.error('Middleware: Error logging URL visit:', error);
   }
 
   return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};