import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.ts'
import { requireAuth, authedUser } from '../middleware/requireAuth.ts'
import { uploadMiddlewareFor, urlForUpload, deleteUploadByUrl } from '../lib/uploads.ts'
import { toSafeUser } from '../lib/safeUser.ts'
import { asyncHandler } from '../lib/asyncHandler.ts'
import { verifyPassword } from '../lib/password.ts'
import { destroySession } from '../lib/session.ts'

const BIO_MAX_LENGTH = 240

const router = Router()

router.use((_req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.patch(
  '/bio',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const bio = req.body?.bio

    if (typeof bio !== 'string' || bio.length > BIO_MAX_LENGTH) {
      res.status(400).json({
        error: 'validation_error',
        field: 'bio',
        message: `A bio precisa ter no máximo ${BIO_MAX_LENGTH} caracteres.`,
      })
      return
    }

    const updated = await prisma.user.update({ where: { id: user.id }, data: { bio: bio.trim() || null } })
    res.status(200).json({ user: toSafeUser(updated) })
  }),
)

router.post(
  '/avatar',
  requireAuth,
  uploadMiddlewareFor('avatar'),
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    if (!req.file) {
      res.status(400).json({ error: 'validation_error', message: 'Envie um arquivo de imagem.' })
      return
    }

    const url = urlForUpload('avatar', req.file.filename)
    await deleteUploadByUrl(user.avatarUrl)
    const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: url } })
    res.status(200).json({ user: toSafeUser(updated) })
  }),
)

router.delete(
  '/avatar',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    await deleteUploadByUrl(user.avatarUrl)
    const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: null } })
    res.status(200).json({ user: toSafeUser(updated) })
  }),
)

router.post(
  '/banner',
  requireAuth,
  uploadMiddlewareFor('banner'),
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    if (!req.file) {
      res.status(400).json({ error: 'validation_error', message: 'Envie um arquivo de imagem.' })
      return
    }

    const url = urlForUpload('banner', req.file.filename)
    await deleteUploadByUrl(user.bannerUrl)
    const updated = await prisma.user.update({ where: { id: user.id }, data: { bannerUrl: url } })
    res.status(200).json({ user: toSafeUser(updated) })
  }),
)

router.delete(
  '/banner',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    await deleteUploadByUrl(user.bannerUrl)
    const updated = await prisma.user.update({ where: { id: user.id }, data: { bannerUrl: null } })
    res.status(200).json({ user: toSafeUser(updated) })
  }),
)

router.delete(
  '/account',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const { password } = req.body ?? {}

    if (!user.passwordHash) {
      res.status(400).json({ error: 'validation_error', message: 'Não é possível excluir essa conta por aqui.' })
      return
    }
    if (typeof password !== 'string' || !password) {
      res.status(400).json({ error: 'validation_error', field: 'password', message: 'Informe sua senha para confirmar.' })
      return
    }

    const passwordOk = await verifyPassword(password, user.passwordHash)
    if (!passwordOk) {
      res.status(401).json({ error: 'invalid_credentials', field: 'password', message: 'Senha incorreta.' })
      return
    }

    // Files on disk aren't covered by the DB cascade below, so they're
    // cleaned up explicitly first — same helper used by the avatar/banner
    // DELETE routes above.
    await deleteUploadByUrl(user.avatarUrl)
    await deleteUploadByUrl(user.bannerUrl)

    // Every other table referencing this user (sessions, progress, exercise
    // attempts, friendships in both directions, etc.) has onDelete: Cascade
    // in schema.prisma, so this one delete is enough to remove it all.
    await prisma.user.delete({ where: { id: user.id } })

    await destroySession(req, res)
    res.status(204).end()
  }),
)

export default router
