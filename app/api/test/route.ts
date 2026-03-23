import { NextRequest, NextResponse } from "next/server"
// import { adminAuth } from "@/lib/firebase-admin"

export async function GET(req: NextRequest) {
  try {
    // Pega token do cookie
    const token = req.cookies.get("token")?.value

    // Se não tiver token → bloqueia
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verifica se o token é válido no Firebase
    // const decoded = await adminAuth.verifyIdToken(token)

    // Retorna sucesso + ID do usuário
    return NextResponse.json({
      ok: true,
      message: "Usuário autenticado (token presente)",
    })
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}