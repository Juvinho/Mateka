import { useCallback, useState } from 'react'

function loadFlag(storageKey: string): boolean {
  try {
    return localStorage.getItem(storageKey) === 'true'
  } catch {
    return true
  }
}

export function useOneTimeFlag(storageKey: string) {
  const [hasSeen, setHasSeen] = useState(() => loadFlag(storageKey))

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(storageKey, 'true')
    } catch {
      // ignore write failures (private browsing, storage full, etc.)
    }
    setHasSeen(true)
  }, [storageKey])

  return { hasSeen, markSeen }
}
