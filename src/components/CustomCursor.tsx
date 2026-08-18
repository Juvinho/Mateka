import { useEffect, useRef, useState } from 'react'

import { lerp } from '../utils/math'

const CLICKABLE_SELECTOR = 'a, button, [data-cursor]'

const canEnableCursor = (): boolean => {
  if (typeof window === 'undefined') return false
  const supportsHover = window.matchMedia('(hover: hover)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return supportsHover && finePointer && !reducedMotion
}

type CustomCursorProps = {
  professorMode?: boolean
}

const CustomCursor = ({ professorMode = false }: CustomCursorProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)

  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [enabled] = useState(() => canEnableCursor())

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
      setVisible(true)

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
      }
    }

    const onPointerOver = (event: PointerEvent): void => {
      const element = event.target as HTMLElement | null
      const nextInteractive = Boolean(element?.closest(CLICKABLE_SELECTOR))
      setInteractive(nextInteractive)
    }

    const onWindowMouseOut = (event: MouseEvent): void => {
      if (event.relatedTarget !== null) return
      setVisible(false)
    }

    const onWindowMouseEnter = (): void => {
      setVisible(true)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('mouseout', onWindowMouseOut)
    window.addEventListener('mouseenter', onWindowMouseEnter)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('mouseout', onWindowMouseOut)
      window.removeEventListener('mouseenter', onWindowMouseEnter)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    let frame = 0

    const tick = (): void => {
      const outerSize = interactive ? 56 : 32

      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12)

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
  }, [enabled, interactive])

  if (!enabled) return null

  return (
    <div
      className={`custom-cursor-root ${visible ? 'is-visible' : 'is-hidden'} ${interactive ? 'is-hover' : ''} ${professorMode ? 'is-professor' : ''}`}
      aria-hidden="true"
    >
      <div
        ref={innerRef}
        className="custom-cursor-inner"
      />
      <div
        ref={outerRef}
        className="custom-cursor-outer"
      >
        <span className="custom-cursor-label">CLIQUE</span>
      </div>
    </div>
  )
}

export default CustomCursor
