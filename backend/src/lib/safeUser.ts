import type { User } from '@prisma/client'

export type SafeUser = {
  id: string
  email: string
  displayName: string
  institution: string | null
  role: string
  createdAt: string
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string | null
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    institution: user.institution,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
  }
}
