import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import path from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import authRouter from './routes/auth.ts'
import profileRouter from './routes/profile.ts'
import socialRouter from './routes/social.ts'

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
const UPLOAD_ROOT = path.resolve(import.meta.dirname, '../uploads')

export const app = express()

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/social', socialRouter)
// Uploaded avatars/banners — see backend/src/lib/uploads.ts for the writer side.
app.use('/api/uploads', express.static(UPLOAD_ROOT, { maxAge: '30d', immutable: true }))

// Last-resort handler for anything a route forwarded via next(err) (see
// asyncHandler) — without this, an unhandled rejection (e.g. the DB being
// briefly unreachable) crashes the whole process instead of just failing
// the one request.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Arquivo muito grande (máximo 5MB).' : 'Falha no upload do arquivo.'
    res.status(400).json({ error: 'upload_error', message })
    return
  }
  if (err instanceof Error && err.message === 'unsupported_file_type') {
    res.status(400).json({ error: 'unsupported_file_type', message: 'Formato de imagem não suportado. Use JPG, PNG ou WebP.' })
    return
  }
  console.error('Unhandled error:', err)
  if (res.headersSent) return
  res.status(500).json({ error: 'internal_error', message: 'Algo deu errado no servidor.' })
})
