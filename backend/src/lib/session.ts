import crypto from 'node:crypto'
import type { Request, Response } from 'express'
import type { User } from '@prisma/client'
import { prisma } from './prisma.ts'

const COOKIE_NAME = 'mateka_session'
const REMEMBER_ME_DURATION_MS = 1000 * 60 * 60 * 24 * 30 // 30 dias — "Manter sessão" marcado
const DEFAULT_SESSION_DURATION_MS = 1000 * 60 * 60 * 24 // 24 horas — comportamento padrão

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Only the hash is ever persisted (schema.prisma's comment on Session.tokenHash
// is explicit about this) — the raw token lives only in the client's cookie.
// `rememberMe` defaults to true so register (which has no such checkbox) keeps
// its existing long-lived session; only the login route passes it explicitly,
// based on the "Manter sessão" checkbox.
export async function createSession(
  userId: string,
  req: Request,
  res: Response,
  options?: { rememberMe?: boolean },
): Promise<void> {
  const rememberMe = options?.rememberMe ?? true
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + (rememberMe ? REMEMBER_ME_DURATION_MS : DEFAULT_SESSION_DURATION_MS))

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresAt,
    },
  })

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  })
}

export async function getSessionUser(req: Request): Promise<User | null> {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) return null
  return session.user
}

export async function destroySession(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[COOKIE_NAME]
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
  res.clearCookie(COOKIE_NAME, { path: '/' })
}
