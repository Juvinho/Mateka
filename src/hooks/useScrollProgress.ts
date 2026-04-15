import { useEffect, useState } from 'react'

const getScrollProgress = (): number => {
  const doc = document.documentElement
  const scrollTop = doc.scrollTop || document.body.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight

  if (scrollHeight <= 0) return 0
  return Math.min(1, Math.max(0, scrollTop / scrollHeight))
}

export const useScrollProgress = (): number => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = (): void => {
      setProgress(getScrollProgress())
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
