import type { User } from '@prisma/client'

export type SafeUser = {
  id: string
  email: string
  displayName: string
  role: string
  createdAt: string
  avatarUrl: string | null
  bannerUrl: string | null
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
  }
}
