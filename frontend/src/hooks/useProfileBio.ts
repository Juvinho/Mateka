import { useCallback, useEffect, useState } from 'react'

function keyFor(userId: string): string {
  return `mateka:profile:${userId}:bio`
}

/**
 * Short bio/status line, scoped per authenticated user id. Same client-only
 * localStorage pattern as useProfileImages — no column for it on `users` yet.
 */
export function useProfileBio(userId: string | undefined) {
  const [bio, setBioState] = useState('')

  useEffect(() => {
    if (!userId) {
      setBioState('')
      return
    }
    try {
      setBioState(localStorage.getItem(keyFor(userId)) ?? '')
    } catch {
      setBioState('')
    }
  }, [userId])

  const setBio = useCallback(
    (value: string) => {
      if (!userId) return
      try {
        localStorage.setItem(keyFor(userId), value)
      } catch {
        // ignore write failures (private browsing, storage full, etc.)
      }
      setBioState(value)
    },
    [userId],
  )

  return { bio, setBio }
}
