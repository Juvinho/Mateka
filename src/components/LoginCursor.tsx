import { useEffect, useRef, useState } from 'react'

import { lerp } from '../utils/math'

const canEnable = (): boolean => {
  if (typeof window === 'undefined') return false
  const hover = window.matchMedia('(hover: hover)').matches
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return hover && fine && !reduced
}

type CursorMode = 'default' | 'input' | 'button'

const LoginCursor = () => {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [enabled] = useState(() => canEnable())

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('cursor-hidden')
    return () => {
      document.body.classList.remove('cursor-hidden')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent): void => {
      targetRef.current = { x: event.clientX, y: event.clientY }
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      }
    }

    const onOver = (event: PointerEvent): void => {
      const el = event.target as HTMLElement | null
      if (!el) return
      if (el.closest('input, textarea, [data-login-input]')) {
        setMode('input')
      } else if (el.closest('button, a, [data-cursor]')) {
        setMode('button')
      } else {
        setMode('default')
      }
    }

    const onOut = (event: MouseEvent): void => {
      if (event.relatedTarget !== null) return
      setVisible(false)
    }

    const onEnter = (): void => setVisible(true)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mouseenter', onEnter)
    }
  }, [enabled])

  // Separate rAF loop only handles smoothed position — rotation is pure CSS.
  useEffect(() => {
    if (!enabled) return

    let frame = 0

    const tick = (): void => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.14)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.14)

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  const interactive = mode === 'button' || mode === 'input'

  return (
    <div
      className={`login-cursor-root ${visible ? 'is-visible' : 'is-hidden'} is-mode-${mode}`}
      aria-hidden="true"
    >
      <div ref={dotRef} className="login-cursor-dot-pos">
        {mode === 'input' ? (
          <span className="login-cursor-symbol">∇</span>
        ) : (
          <span className="login-cursor-dot" />
        )}
      </div>
      <div ref={ringRef} className="login-cursor-ring-pos">
        <span className={`login-cursor-ring ${interactive ? 'on-interactive' : ''} is-${mode}`} />
      </div>
    </div>
  )
}

export default LoginCursor
