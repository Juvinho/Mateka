import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.ts'
import { requireAuth, authedUser } from '../middleware/requireAuth.ts'
import { toPublicUser } from '../lib/publicUser.ts'
import { asyncHandler } from '../lib/asyncHandler.ts'

const router = Router()

router.use((_req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store')
  next()
})

type Relationship = 'self' | 'none' | 'friends' | 'pending_sent' | 'pending_received' | 'blocked' | 'blocked_by'

async function relationshipBetween(meId: string, otherId: string): Promise<Relationship> {
  if (meId === otherId) return 'self'

  const [forward, reverse] = await Promise.all([
    prisma.friendship.findUnique({ where: { requesterId_addresseeId: { requesterId: meId, addresseeId: otherId } } }),
    prisma.friendship.findUnique({ where: { requesterId_addresseeId: { requesterId: otherId, addresseeId: meId } } }),
  ])

  // A 'blocked' row's requesterId is always the blocker (see schema.prisma's
  // comment on Friendship.status) — check both directions explicitly rather
  // than falling through to the pending/accepted logic below.
  if (forward?.status === 'blocked') return 'blocked'
  if (reverse?.status === 'blocked') return 'blocked_by'

  const row = forward ?? reverse
  if (!row) return 'none'
  if (row.status === 'accepted') return 'friends'
  return forward ? 'pending_sent' : 'pending_received'
}

router.get(
  '/users/search',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''

    if (q.length < 2) {
      res.status(200).json({ users: [] })
      return
    }

    const results = await prisma.user.findMany({
      where: { displayName: { contains: q, mode: 'insensitive' }, id: { not: user.id } },
      orderBy: { displayName: 'asc' },
      take: 20,
    })

    res.status(200).json({ users: results.map(toPublicUser) })
  }),
)

router.get(
  '/users/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const target = await prisma.user.findUnique({ where: { id: req.params.id } })

    if (!target) {
      res.status(404).json({ error: 'not_found', message: 'Usuário não encontrado.' })
      return
    }

    const relationship = await relationshipBetween(user.id, target.id)
    res.status(200).json({ user: toPublicUser(target), relationship })
  }),
)

router.post(
  '/friends/:userId/request',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const targetId = req.params.userId

    if (targetId === user.id) {
      res.status(400).json({ error: 'validation_error', message: 'Não é possível adicionar a si mesmo como amigo.' })
      return
    }

    const target = await prisma.user.findUnique({ where: { id: targetId } })
    if (!target) {
      res.status(404).json({ error: 'not_found', message: 'Usuário não encontrado.' })
      return
    }

    const [forward, reverse] = await Promise.all([
      prisma.friendship.findUnique({ where: { requesterId_addresseeId: { requesterId: user.id, addresseeId: targetId } } }),
      prisma.friendship.findUnique({ where: { requesterId_addresseeId: { requesterId: targetId, addresseeId: user.id } } }),
    ])

    if (forward?.status === 'blocked' || reverse?.status === 'blocked') {
      // Generic message either way — don't confirm to the caller which of
      // the two blocked the other.
      res.status(403).json({ error: 'forbidden', message: 'Não é possível adicionar esse usuário.' })
      return
    }

    if (forward) {
      // 'pending' or 'accepted' — idempotent, nothing to do. A prior decline
      // deletes the row instead of leaving it 'declined' (see DELETE below),
      // so this can only ever be one of those two statuses.
    } else if (reverse) {
      if (reverse.status === 'pending') {
        // The other person already asked us first — accept it outright
        // instead of leaving two crossed pending requests. From their
        // perspective this is exactly an acceptance of their request, so it
        // gets the same "notify them" treatment as the /accept route below.
        await prisma.friendship.update({
          where: { id: reverse.id },
          data: { status: 'accepted', requesterSeenAcceptance: false },
        })
      }
      // 'accepted' — idempotent, nothing to do.
    } else {
      await prisma.friendship.create({ data: { requesterId: user.id, addresseeId: targetId, status: 'pending' } })
    }

    const relationship = await relationshipBetween(user.id, targetId)
    res.status(200).json({ relationship })
  }),
)

router.post(
  '/friends/:userId/accept',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const requesterId = req.params.userId

    const pending = await prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId, addresseeId: user.id } },
    })

    if (!pending || pending.status !== 'pending') {
      res.status(404).json({ error: 'not_found', message: 'Nenhum pedido pendente desse usuário.' })
      return
    }

    await prisma.friendship.update({
      where: { id: pending.id },
      data: { status: 'accepted', requesterSeenAcceptance: false },
    })
    res.status(200).json({ relationship: 'friends' satisfies Relationship })
  }),
)

router.post(
  '/friends/:userId/block',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const targetId = req.params.userId

    if (targetId === user.id) {
      res.status(400).json({ error: 'validation_error', message: 'Não é possível bloquear a si mesmo.' })
      return
    }

    const target = await prisma.user.findUnique({ where: { id: targetId } })
    if (!target) {
      res.status(404).json({ error: 'not_found', message: 'Usuário não encontrado.' })
      return
    }

    // Blocking wipes out whatever relationship existed before (pending
    // request either way, or an existing friendship) and replaces it with a
    // single 'blocked' row — requesterId is always the blocker here.
    await prisma.$transaction([
      prisma.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: user.id, addresseeId: targetId },
            { requesterId: targetId, addresseeId: user.id },
          ],
        },
      }),
      prisma.friendship.create({ data: { requesterId: user.id, addresseeId: targetId, status: 'blocked' } }),
    ])

    res.status(200).json({ relationship: 'blocked' satisfies Relationship })
  }),
)

router.delete(
  '/friends/:userId',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = authedUser(res)
    const otherId = req.params.userId

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: otherId },
          { requesterId: otherId, addresseeId: user.id },
        ],
      },
    })

    // A block can only be lifted by whoever set it — the blocked party has
    // no say in removing it via this same "unfriend/cancel/decline" route.
    if (existing?.status === 'blocked' && existing.requesterId !== user.id) {
      res.status(403).json({ error: 'forbidden', message: 'Não é possível remover esse bloqueio.' })
      return
    }

    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: otherId },
          { requesterId: otherId, addresseeId: user.id },
        ],
      },
    })

    res.status(200).json({ relationship: 'none' satisfies Relationship })
  }),
)

router.get(
  '/friends',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    const rows = await prisma.friendship.findMany({
      where: { status: 'accepted', OR: [{ requesterId: user.id }, { addresseeId: user.id }] },
      include: { requester: true, addressee: true },
    })

    const friends = rows.map((row) => toPublicUser(row.requesterId === user.id ? row.addressee : row.requester))
    res.status(200).json({ friends })
  }),
)

router.get(
  '/friends/requests',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    const [received, sent] = await Promise.all([
      prisma.friendship.findMany({ where: { addresseeId: user.id, status: 'pending' }, include: { requester: true } }),
      prisma.friendship.findMany({ where: { requesterId: user.id, status: 'pending' }, include: { addressee: true } }),
    ])

    res.status(200).json({
      received: received.map((row) => toPublicUser(row.requester)),
      sent: sent.map((row) => toPublicUser(row.addressee)),
    })
  }),
)

router.get(
  '/friends/accepted-unseen',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    const rows = await prisma.friendship.findMany({
      where: { requesterId: user.id, status: 'accepted', requesterSeenAcceptance: false },
      include: { addressee: true },
    })

    res.status(200).json({ users: rows.map((row) => toPublicUser(row.addressee)) })
  }),
)

router.post(
  '/friends/accepted-unseen/seen',
  requireAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const user = authedUser(res)
    await prisma.friendship.updateMany({
      where: { requesterId: user.id, status: 'accepted', requesterSeenAcceptance: false },
      data: { requesterSeenAcceptance: true },
    })

    res.status(200).json({ ok: true })
  }),
)

export default router
