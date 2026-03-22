# 🚀 Stockly - Sistema de Gerenciamento de Ferramentas

## 📌 Sobre o Projeto

O **Stockly** é uma aplicação web desenvolvida para gerenciamento de ferramentas e controle de acesso, com foco em segurança e boas práticas modernas de desenvolvimento.

O sistema permite autenticação de usuários, controle de acesso a rotas protegidas e integração com banco de dados em nuvem utilizando Firebase.

---

## 🛠️ Tecnologias Utilizadas

* Next.js
* React
* Firebase (Auth + Firestore)
* TypeScript
* Tailwind CSS

---

## 🔐 Segurança Implementada

Este projeto aplica conceitos reais de segurança, incluindo:

* 🔑 Autenticação com Firebase
* 🍪 Uso de cookies HTTP-only para proteção de sessão
* 🛡️ Middleware para proteção de rotas
* 🔒 Validação de token no backend com Firebase Admin
* 🚫 Proteção contra XSS (Cross-Site Scripting)
* 🔥 Regras de segurança no Firestore

---

## 🔄 Fluxo de Autenticação

1. Usuário realiza login com email e senha
2. Firebase valida as credenciais
3. Um token de autenticação é gerado
4. O token é armazenado em cookie seguro (httpOnly)
5. Middleware verifica acesso às rotas protegidas
6. Backend valida o token antes de liberar dados

---

## 📂 Estrutura do Projeto

```
/app            → Rotas e páginas (Next.js)
/components     → Componentes reutilizáveis
/lib            → Configurações do Firebase
/app/api        → Rotas de API (backend)
/middleware.ts  → Proteção de rotas
```

---

## ⚙️ Como Rodar o Projeto

### 1. Clonar o repositório

```
git clone https://github.com/seu-usuario/seu-repo.git
```

### 2. Instalar dependências

```
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

### 4. Rodar o projeto

```
npm run dev
```

---

## 🧪 Testes de Segurança

* Acesso a rotas protegidas sem login é bloqueado
* Tokens inválidos são rejeitados pelo backend
* Cookies não podem ser acessados via JavaScript
* Inputs são tratados para evitar execução de scripts

---

## 🎯 Objetivo

Este projeto foi desenvolvido como trabalho de conclusão de curso, com o objetivo de aplicar conceitos de desenvolvimento web moderno e segurança em aplicações reais.

---