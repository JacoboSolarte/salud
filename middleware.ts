import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/api/auth", "/api/health"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (token && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
