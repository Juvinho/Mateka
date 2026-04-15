import { useCallback, useMemo, useRef } from 'react'

const canUseTilt = (): boolean => {
  if (typeof window === 'undefined') return false
  const supportsHover = window.matchMedia('(hover: hover)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return supportsHover && finePointer && !reducedMotion
}

export const useCardTilt = () => {
  const cardRef = useRef<HTMLElement | null>(null)
  const glareRef = useRef<HTMLDivElement | null>(null)

  const enabled = useMemo(() => canUseTilt(), [])

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLElement>): void => {
    if (!enabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    const ratioX = Math.min(1, Math.max(0, localX / rect.width))
    const ratioY = Math.min(1, Math.max(0, localY / rect.height))

    const rotateX = (0.5 - ratioY) * 16
    const rotateY = (ratioX - 0.5) * 16

    cardRef.current.style.transition = 'transform 0.1s ease'
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`
    cardRef.current.style.setProperty('--glare-x', `${(ratioX * 100).toFixed(1)}%`)
    cardRef.current.style.setProperty('--glare-y', `${(ratioY * 100).toFixed(1)}%`)

    if (!glareRef.current) return

    glareRef.current.style.opacity = '1'
  }, [enabled])

  const onMouseLeave = useCallback((): void => {
    if (!cardRef.current) return

    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'

    if (!glareRef.current) return

    glareRef.current.style.opacity = '0'
  }, [])

  return {
    enabled,
    cardRef,
    glareRef,
    onMouseMove,
    onMouseLeave,
  }
}
