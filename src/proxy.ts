import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export { auth as proxy };

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
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)",
    "/",
  ],
};
