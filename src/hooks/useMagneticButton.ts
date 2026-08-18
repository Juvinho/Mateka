import { useCallback, useMemo, useRef } from 'react'

const MAX_DISTANCE = 80

const canUseMagnetic = (): boolean => {
  if (typeof window === 'undefined') return false
  const supportsHover = window.matchMedia('(hover: hover)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return supportsHover && finePointer && !reducedMotion
}

export const useMagneticButton = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const frameRef = useRef<number | null>(null)

  const enabled = useMemo(() => canUseMagnetic(), [])

  const applyTransform = useCallback((buttonX: number, buttonY: number): void => {
    const button = buttonRef.current
    if (!button) return

    button.style.transform = `translate3d(${buttonX.toFixed(2)}px, ${buttonY.toFixed(2)}px, 0)`

    const text = textRef.current
    if (!text) return

    text.style.transform = `translate3d(${(-buttonX * 0.5).toFixed(2)}px, ${(-buttonY * 0.5).toFixed(2)}px, 0)`
  }, [])

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!enabled || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const distance = Math.hypot(dx, dy)

    const nextX = distance <= MAX_DISTANCE ? dx * 0.35 : 0
    const nextY = distance <= MAX_DISTANCE ? dy * 0.35 : 0

    buttonRef.current.style.transition = 'transform 0.08s ease-out'
    if (textRef.current) {
      textRef.current.style.transition = 'transform 0.08s ease-out'
    }

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = window.requestAnimationFrame(() => {
      applyTransform(nextX, nextY)
      frameRef.current = null
    })
  }, [applyTransform, enabled])

  const onMouseLeave = useCallback((): void => {
    if (!buttonRef.current) return

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    buttonRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'

    if (textRef.current) {
      textRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }

    applyTransform(0, 0)
  }, [applyTransform])

  return {
    enabled,
    buttonRef,
    textRef,
    onMouseMove,
    onMouseLeave,
  }
}
