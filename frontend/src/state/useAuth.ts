import { useContext } from 'react'
import { AuthContext } from './authContextStore.ts'
import type { AuthContextValue } from './authContextStore.ts'

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
