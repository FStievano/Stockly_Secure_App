import { NextRequest, NextResponse } from "next/server"
// import { adminAuth } from "@/lib/firebase-admin"

export async function GET(req: NextRequest) {
  try {
    // 🔐 pega o token do header
    const token = req.headers.get("authorization")?.split("Bearer ")[1]

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // 🔥 valida o token no Firebase
    // const decoded = await adminAuth.verifyIdToken(token)

    return NextResponse.json({
      ok: true,
      message: "Rota protegida (sem admin)",
    })
  } catch (error) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}