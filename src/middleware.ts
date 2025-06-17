import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth checks for static files, API routes, and other non-page requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname
  const locale = pathname.split("/")[1] || routing.defaultLocale;
  const isValidLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number]
  );

  if (!isValidLocale) {
    return intlResponse;
  }

  // Define routes that need auth checking
  const protectedRoutes = [
    "/home",
    "/trang-chu",
    "/tasks",
    "/viec",
    "/vehicles",
    "/phuong-tien",
  ];
  const authRoutes = ["/login", "/dang-nhap", "/signup", "/dang-ky"];

  // Remove locale from pathname for route checking
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // Check if current path needs auth checking
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale === route);
  const isRootRoute = pathWithoutLocale === "/";
  // Skip auth check entirely if not needed
  if (!isProtectedRoute && !isAuthRoute && !isRootRoute) {
    return intlResponse;
  }
  // Quick check: look for Supabase auth cookies
  const cookieStore = request.cookies;
  const hasAuthTokens = cookieStore
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") &&
        cookie.value &&
        cookie.value !== "undefined"
    );
  // If no auth cookies exist and trying to access protected route, redirect immediately
  if (!hasAuthTokens && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // If no auth cookies exist and on auth/root routes, allow through (user not logged in)
  if (!hasAuthTokens && (isAuthRoute || isRootRoute)) {
    return intlResponse;
  }

  // Only make API call if we have auth cookies and need to verify them
  if (hasAuthTokens) {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Use getUser for security (but only when we have cookies to check)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect logic
    if (!user && isProtectedRoute) {
      // Invalid/expired token trying to access protected route
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    if (user && (isAuthRoute || isRootRoute)) {
      // Valid user trying to access auth routes or root
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/home`;
      return NextResponse.redirect(url);
    }

    // Return the response with updated cookies
    if (intlResponse instanceof Response) {
      response.cookies.getAll().forEach((cookie) => {
        intlResponse.headers.set(
          "Set-Cookie",
          `${cookie.name}=${cookie.value}; Path=/`
        );
      });
      return intlResponse;
    }
    return response;
  }

  // Fallback: return intl response if no auth logic matched
  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
