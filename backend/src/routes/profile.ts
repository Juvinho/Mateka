import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.ts'
import { requireAuth, authedUser } from '../middleware/requireAuth.ts'
import { uploadMiddlewareFor, urlForUpload, deleteUploadByUrl } from '../lib/uploads.ts'
import { toSafeUser } from '../lib/safeUser.ts'
import { asyncHandler } from '../lib/asyncHandler.ts'

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

export default router
