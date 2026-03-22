import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Pega o cookie do usuário
  const token = req.cookies.get("token")

  // Se tentar acessar dashboard sem estar logado → bloqueia
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

// Define onde o middleware atua
export const config = {
  matcher: ["/dashboard/:path*"],
}