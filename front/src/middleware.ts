import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed", // Don't show /fr prefix for default locale
});

const ALLOWED_ROUTES = ["/coming-soon", "/book-test-drive"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and Next.js internals/static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/media") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Allow coming soon and book test drive pages
  if (
    ALLOWED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Use next-intl middleware to handle locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Exclude static files, media, and non-locale routes
    "/((?!_next/static|_next/image|favicon.ico|media/.*|coming-soon|book-test-drive|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|pdf)).*)",
  ],
};
