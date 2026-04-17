import { useEffect, useState } from 'react'

export const useScrollVelocity = (threshold = 40): boolean => {
  const [boosting, setBoosting] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    let timeout: number | null = null
    let ticking = false

    const onScroll = (): void => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const now = performance.now()
        const y = window.scrollY
        const dy = Math.abs(y - lastY)
        const dt = Math.max(1, now - lastT)
        const velocity = (dy / dt) * 1000 // px/s

        lastY = y
        lastT = now
        ticking = false

        if (velocity > threshold * 20) {
          setBoosting(true)
          if (timeout) window.clearTimeout(timeout)
          timeout = window.setTimeout(() => setBoosting(false), 300)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [threshold])

  return boosting
}
