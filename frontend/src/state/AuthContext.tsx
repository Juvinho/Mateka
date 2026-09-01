import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './authContextStore.ts'
import type { AuthUser, AuthStatus } from './authContextStore.ts'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      if (!response.ok) {
        setUser(null)
        setStatus('guest')
        return
      }
      const body = await response.json()
      setUser(body.user)
      setStatus('authenticated')
    } catch {
      setUser(null)
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // best-effort — nothing more to do client-side if this fails
    }
    setUser(null)
    setStatus('guest')
  }, [])

  const value = useMemo(() => ({ user, status, logout, refresh }), [user, status, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
