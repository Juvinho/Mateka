import { useEffect, useRef, useState } from 'react'

import { lerp } from '../utils/math'

const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'

const CLICK_FLASH_MS = 120

const prefersFinePointer = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: fine)').matches
}

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const CustomCursor = () => {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)

  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const [interactive, setInteractive] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [flash, setFlash] = useState(false)
  const [enabled] = useState(() => prefersFinePointer() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cursor-hidden')
      return
    }

    document.body.classList.add('cursor-hidden')

    return () => {
      document.body.classList.remove('cursor-hidden')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onPointerMove = (event: PointerEvent): void => {
      const { clientX, clientY } = event
      targetRef.current = { x: clientX, y: clientY }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
      }
    }

    const onPointerOver = (event: PointerEvent): void => {
      const element = event.target as HTMLElement | null
      const nextInteractive = Boolean(element?.closest(CLICKABLE_SELECTOR))
      setInteractive(nextInteractive)
    }

    const onPointerDown = (): void => {
      setPressed(true)
      setFlash(true)
      window.setTimeout(() => setFlash(false), CLICK_FLASH_MS)
    }

    const onPointerUp = (): void => {
      setPressed(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    let frame = 0

    const tick = (): void => {
      const outerSize = pressed ? 20 : interactive ? 60 : 36

      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.16)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.16)

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${currentRef.current.x - outerSize / 2}px, ${currentRef.current.y - outerSize / 2}px, 0)`
        outerRef.current.style.width = `${outerSize}px`
        outerRef.current.style.height = `${outerSize}px`
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [enabled, interactive, pressed])

  if (!enabled) return null

  return (
    <>
      <div
        ref={innerRef}
        aria-hidden="true"
        className={`custom-cursor-inner ${interactive ? 'is-hover' : ''}`}
      />
      <div
        ref={outerRef}
        aria-hidden="true"
        className={`custom-cursor-outer ${interactive ? 'is-hover' : ''} ${pressed ? 'is-pressed' : ''} ${flash ? 'is-flash' : ''}`}
      />
    </>
  )
}

export default CustomCursor
