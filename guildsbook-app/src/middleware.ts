import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que precisam de autenticação
  const protectedRoutes = [
    "/api/user",
    "/profile",
    "/dashboard",
    // Adicione outras rotas que precisam de autenticação
  ];

  // Rotas de autenticação que não devem ser protegidas
  const authRoutes = ["/api/auth"];

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Se for rota protegida, verificar autenticação
  if (isProtectedRoute && !isAuthRoute) {
    const session = await auth();

    if (!session) {
      // Redirecionar para login se não autenticado
      const signInUrl = new URL("/api/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};