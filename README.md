<div align="center">

# AnonDMs

Anonymous, privacy‑minded messaging platform with modern, type‑safe tooling.

</div>

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js (App Router, Edge runtime for streaming) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma + Accelerate (Data Proxy) |
| Auth | next-auth (email verification + credentials) |
| Validation | Zod |
| Email | Resend |
| Security | bcryptjs password hashing, verification codes |
| AI | Vercel AI SDK + OpenAI (question & prompt suggestions) |
| Styling | Tailwind CSS 4 / PostCSS |
| Animations | GSAP |
| Tooling | ESLint, TypeScript strict mode |

## ✨ Features

- Email + username based signup with verification code & expiry
- Secure credential sign‑in (hashed passwords)
- Username availability & validation
- Toggle for accepting / pausing anonymous messages
- Anonymous message submission with server-side validation
- Relational message storage (`User` ↔ `Message[]`)
- AI‑generated or curated suggested questions (Edge streaming)
- Fallback suggestions when AI key absent
- Basic rate limiting & content filtering for suggestion endpoint
- Consistent JSON response envelope
- Strong input validation via Zod across APIs

---
