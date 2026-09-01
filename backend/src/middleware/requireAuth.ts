import type { NextFunction, Request, Response } from 'express'
import type { User } from '@prisma/client'
import { getSessionUser } from '../lib/session.ts'

// Attaches the authenticated user to res.locals.user (avoids augmenting
// Express's global Request type just for this one field) or rejects with 401.
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await getSessionUser(req)
  if (!user) {
    res.status(401).json({ error: 'not_authenticated' })
    return
  }
  res.locals.user = user
  next()
}

export function authedUser(res: Response): User {
  return res.locals.user as User
}
