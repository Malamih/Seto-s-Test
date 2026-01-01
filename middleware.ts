import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const rolePaths = {
  "/dashboard": ["STUDENT"],
  "/instructor": ["INSTRUCTOR"],
  "/admin": ["ADMIN"]
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedEntry = Object.entries(rolePaths).find(([path]) => pathname.startsWith(path));

  if (!protectedEntry) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const [, roles] = protectedEntry;
  if (!roles.includes(String(token.role))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/instructor/:path*", "/admin/:path*"]
};
