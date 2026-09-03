import { createContext } from 'react'

export type AuthUser = {
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

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

export type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
