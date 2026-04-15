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
    let frame: number | null = null

    const updateProgress = (): void => {
      frame = null
      setProgress(getScrollProgress())
    }

    const requestUpdate = (): void => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    const onScroll = (): void => {
      requestUpdate()
    }

    const onResize = (): void => {
      requestUpdate()
    }

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden' && frame !== null) {
        window.cancelAnimationFrame(frame)
        frame = null
        return
      }

      requestUpdate()
    }

    requestUpdate()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)

      if (frame === null) return
      window.cancelAnimationFrame(frame)
      frame = null
    }
  }, [])

  return progress
}
