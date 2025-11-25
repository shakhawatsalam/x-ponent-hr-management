import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes: Record<string, string[]> = {
  "/users": ["hr"],
  "/payroll": ["hr"],
  "/attendance": ["hr", "manager"],
  "/performance": ["manager"],
};

function getRole(request: NextRequest): string | null {
  const token = request.cookies.get("authToken")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.role || null;
  } catch (err) {
    console.log("JWT error:", err);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/unauthorized") {
    return NextResponse.next();
  }

  for (const route in protectedRoutes) {
    if (path.startsWith(route)) {
      const userRole = getRole(request);
      const allowedRoles = protectedRoutes[route];

      if (!userRole || !allowedRoles.includes(userRole)) {
        if (userRole === "manager") {
          return NextResponse.redirect(new URL("/attendance", url.origin));
        }
        console.log("Access denied - redirecting to unauthorized");
        return NextResponse.redirect(new URL("/unauthorized", url.origin));
      }

      break;
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-proxy", "active");
  return res;
}

export const config = {
  matcher: [
    "/users/:path*",
    "/payroll/:path*",
    "/attendance/:path*",
    "/performance/:path*",
  ],
};
