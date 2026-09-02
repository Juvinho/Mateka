import type { User } from '@prisma/client'

// Shown to OTHER users (search results, friend lists, public profile pages) —
// deliberately narrower than SafeUser: no email, no lockout fields. `role` is
// included (unlike email) because it's not sensitive — it only drives the
// cosmetic 'creator' badge on a profile, visible to anyone viewing it.
export type PublicUser = {
  id: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string | null
  role: string
  createdAt: string
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }
}
