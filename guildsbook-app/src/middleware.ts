import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // As rotas de API já verificam autenticação individualmente
  // usando getUserId() que funciona no Node.js runtime
  // O middleware roda no edge runtime e não pode usar Prisma/auth() diretamente
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};