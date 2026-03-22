import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Recebe o token enviado pelo frontend (após login)
  const { token } = await req.json()

  const res = NextResponse.json({ ok: true })

  // 🔐 Salva o token em um cookie seguro
  res.cookies.set("token", token, {
    httpOnly: true, 
    // PROTEÇÃO XSS:
    // impede que JavaScript no navegador acesse o cookie
    // Ex: document.cookie NÃO consegue pegar o token
    // → evita roubo de sessão por scripts maliciosos

    secure: true, 
    // só envia o cookie em HTTPS
    // → evita interceptação em redes inseguras

    sameSite: "strict", 
    // 🔒 protege contra requisições externas (CSRF)
    // → evita que outros sites enviem requisições usando seu cookie

    path: "/", 
    // cookie válido para todo o site
  })

  return res
}