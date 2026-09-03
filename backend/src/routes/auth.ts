import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.ts'
import { hashPassword, verifyPassword } from '../lib/password.ts'
import { createSession, destroySession, getSessionUser } from '../lib/session.ts'
import { asyncHandler } from '../lib/asyncHandler.ts'
import { toSafeUser } from '../lib/safeUser.ts'

const router = Router()

// Auth responses reflect session state that can change without the URL
// changing (login/logout) — never let the browser serve a cached/stale one,
// especially GET /me, which a 304 revalidation would otherwise happily
// answer from cache after the cookie backing it is long gone.
router.use((_req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store')
  next()
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// RN-11: 5 tentativas de login malsucedidas consecutivas -> bloqueia por 15min.
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 1000 * 60 * 15

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, institution } = req.body ?? {}

  if (typeof name !== 'string' || name.trim().length < 3) {
    res.status(400).json({ error: 'validation_error', field: 'name', message: 'Nome precisa ter ao menos 3 caracteres.' })
    return
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    res.status(400).json({ error: 'validation_error', field: 'email', message: 'Email inválido.' })
    return
  }
  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'validation_error', field: 'password', message: 'Senha precisa ter pelo menos 8 caracteres.' })
    return
  }
  if (typeof institution !== 'string' || !institution.trim()) {
    res.status(400).json({ error: 'validation_error', field: 'institution', message: 'Informe sua instituição de ensino.' })
    return
  }

  const passwordHash = await hashPassword(password)

  try {
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        displayName: name.trim(),
        institution: institution.trim(),
        passwordHash,
        authProvider: 'email',
      },
    })

    await createSession(user.id, req, res)
    res.status(201).json({ user: toSafeUser(user) })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'email_taken', field: 'email', message: 'Este email já está cadastrado.' })
      return
    }
    console.error('register failed:', err)
    res.status(500).json({ error: 'internal_error', message: 'Não foi possível criar a conta agora.' })
  }
}))

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body ?? {}

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    res.status(400).json({ error: 'validation_error', message: 'Informe email e senha.' })
    return
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })

  // Same generic message whether the account doesn't exist, has no password
  // (OAuth-only), or the password is wrong — never leak which case it was.
  const rejectInvalid = () => {
    res.status(401).json({ error: 'invalid_credentials', message: 'Email ou senha incorretos.' })
  }

  if (!user || !user.passwordHash) {
    rejectInvalid()
    return
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000)
    res.status(423).json({
      error: 'account_locked',
      message: `Conta bloqueada por excesso de tentativas. Tente novamente em ${minutes} min.`,
    })
    return
  }

  const passwordOk = await verifyPassword(password, user.passwordHash)

  if (!passwordOk) {
    const failedLoginAttempts = user.failedLoginAttempts + 1
    const lockingNow = failedLoginAttempts >= MAX_FAILED_ATTEMPTS
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: lockingNow ? 0 : failedLoginAttempts,
        lockedUntil: lockingNow ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
      },
    })
    rejectInvalid()
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  })

  await createSession(user.id, req, res, { rememberMe: rememberMe === true })
  res.status(200).json({ user: toSafeUser(user) })
}))

router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  await destroySession(req, res)
  res.status(204).end()
}))

router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const user = await getSessionUser(req)
  if (!user) {
    res.status(401).json({ error: 'not_authenticated' })
    return
  }
  res.status(200).json({ user: toSafeUser(user) })
}))

export default router
