import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Role-based access control
    const path = req.nextUrl.pathname;
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/recruiter") && token.role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/manager") && token.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/recruiter/:path*",
    "/manager/:path*",
    "/auth/:path*",
    "/api/resume/:path*",
    "/api/analysis/:path*",
    "/api/company/:path*",
  ],
}; 