import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Create Supabase client for middleware
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes (dashboard routes)
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

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale === route);
  // Redirect logic
  if (!user && isProtectedRoute) {
    // User not authenticated trying to access protected route
    // console.log(
    //   `Redirecting unauthenticated user from ${pathname} to /${locale}`
    // );
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  if (user && (isAuthRoute || pathWithoutLocale === "/")) {
    // User authenticated trying to access auth routes or root
    // console.log(
    //   `Redirecting authenticated user from ${pathname} to /${locale}/home`
    // );
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/home`;
    return NextResponse.redirect(url);
  }

  // Log successful middleware pass
  // console.log(
  //   `Middleware pass: ${pathname}, user: ${
  //     user ? "authenticated" : "not authenticated"
  //   }, protected: ${isProtectedRoute}, auth route: ${isAuthRoute}`
  // );

  // Return the internationalization response with updated cookies
  if (intlResponse instanceof Response) {
    // Copy cookies from our response to the intl response
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

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
