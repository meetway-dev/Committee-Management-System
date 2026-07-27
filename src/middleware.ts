export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/committees/:path*",
    "/payments/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/search/:path*",
    "/admin/:path*",
  ],
};
