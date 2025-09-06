// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const protectedPaths = ["/dashboard", "/admin", "/profile"];

  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Si es ruta protegida y NO hay sesión → redirigir a login
  if (isProtectedRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Permitir acceso
  return NextResponse.next();
}

// ✅ Configuración del matcher — ¡CORREGIDO!
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
  ],
};
