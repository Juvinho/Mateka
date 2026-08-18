import { useEffect, useMemo, useRef, useState } from 'react'

import { lerp } from '../utils/math'

type EquationColor = 'cyan' | 'pink' | 'purple'

type EquationDefinition = {
  text: string
  color: EquationColor
  description: string
}

type RuntimeEquation = EquationDefinition & {
  id: string
  x: number
  y: number
  phaseOffset: number
  size: number
  opacity: number
  scale: number
  hoverOffsetX: number
  hoverOffsetY: number
  underlineUntil: number
  hovered: boolean
}

const EQUATIONS: EquationDefinition[] = [
  { text: 'e^(iπ) + 1 = 0', color: 'cyan', description: 'Identidade de Euler' },
  { text: '∫₀^∞ e^(-x²)dx = √π/2', color: 'pink', description: 'Integral Gaussiana' },
  { text: 'F = ma', color: 'purple', description: 'Segunda Lei de Newton' },
  { text: '∑(1/n²) = π²/6', color: 'cyan', description: 'Problema de Basel' },
  { text: "f'(x) = lim Δx→0", color: 'pink', description: 'Definição de derivada' },
  { text: 'sin²θ + cos²θ = 1', color: 'purple', description: 'Identidade trigonométrica fundamental' },
  { text: '∇²φ = 0', color: 'cyan', description: 'Equação de Laplace' },
  { text: 'det(A) = ∑ εᵢⱼₖ aᵢ...', color: 'pink', description: 'Forma expandida do determinante' },
]

const APPROX_WIDTH = 280
const APPROX_HEIGHT = 42

const createInitialEquations = (): RuntimeEquation[] => {
  const width = typeof window === 'undefined' ? 1200 : window.innerWidth
  const height = typeof window === 'undefined' ? 800 : window.innerHeight

  return EQUATIONS.map((equation, index) => ({
    ...equation,
    id: `${index}-${equation.text}`,
    x: Math.random() * Math.max(240, width - APPROX_WIDTH),
    y: Math.random() * Math.max(160, height - 180) + 50,
    phaseOffset: Math.random() * Math.PI * 2,
    size: 13 + Math.random() * 5,
    opacity: 0.06,
    scale: 1,
    hoverOffsetX: 0,
    hoverOffsetY: 0,
    underlineUntil: 0,
    hovered: false,
  }))
}

const colorClassByTone: Record<EquationColor, string> = {
  cyan: 'tone-cyan',
  pink: 'tone-pink',
  purple: 'tone-purple',
}

const FloatingEquations = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const equationsRef = useRef<RuntimeEquation[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const [snapshot, setSnapshot] = useState<RuntimeEquation[]>([])

  const layersRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const el = layersRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    equationsRef.current = createInitialEquations()
    setSnapshot([...equationsRef.current])
  }, [])

  useEffect(() => {
    if (equationsRef.current.length === 0) return

    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true }
    }

    const onPointerLeave = (): void => {
      mouseRef.current = { x: -9999, y: -9999, active: false }
    }

    const onResize = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight
      const equations = equationsRef.current

      for (const equation of equations) {
        equation.x = Math.min(Math.max(equation.x, -APPROX_WIDTH), width + 10)
        equation.y = Math.min(Math.max(equation.y, -APPROX_HEIGHT), height + 10)
      }

      setSnapshot([...equations])
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (equationsRef.current.length === 0) return
    if (reducedMotion) {
      const staticEquations = equationsRef.current.map((equation) => ({
        ...equation,
        opacity: 0.1,
        scale: 1,
        hoverOffsetX: 0,
        hoverOffsetY: 0,
      }))
      equationsRef.current = staticEquations
      setSnapshot(staticEquations)
      return
    }

    let frame = 0

    const tick = (now: number): void => {
      frame = window.requestAnimationFrame(tick)
      if (!isVisibleRef.current) return

      const time = now / 1000
      const width = window.innerWidth
      const height = window.innerHeight
      const equations = equationsRef.current
      const mouse = mouseRef.current

      for (const equation of equations) {
        equation.x += Math.sin(time * 0.3 + equation.phaseOffset) * 0.3
        equation.y += Math.cos(time * 0.2 + equation.phaseOffset) * 0.2

        if (equation.x < -APPROX_WIDTH) equation.x = width + 16
        if (equation.x > width + 16) equation.x = -APPROX_WIDTH
        if (equation.y < -APPROX_HEIGHT) equation.y = height + 16
        if (equation.y > height + 16) equation.y = -APPROX_HEIGHT

        const centerX = equation.x + APPROX_WIDTH * 0.42
        const centerY = equation.y + APPROX_HEIGHT * 0.5
        const dx = centerX - mouse.x
        const dy = centerY - mouse.y
        const distance = Math.hypot(dx, dy)

        const isNear = mouse.active && distance < 120
        const isHoverComplete = mouse.active && distance < 54

        equation.opacity = lerp(equation.opacity, isNear ? 0.75 : 0.06, isNear ? 0.08 : 0.04)
        equation.scale = lerp(equation.scale, isNear ? 1.15 : 1, 0.08)

        const repulse = isNear && distance > 0.001 ? (1 - distance / 120) * 14 : 0
        const targetOffsetX = repulse > 0 ? (dx / distance) * repulse : 0
        const targetOffsetY = repulse > 0 ? (dy / distance) * repulse : 0

        equation.hoverOffsetX = lerp(equation.hoverOffsetX, targetOffsetX, 0.16)
        equation.hoverOffsetY = lerp(equation.hoverOffsetY, targetOffsetY, 0.16)

        if (isHoverComplete && !equation.hovered) {
          equation.underlineUntil = now + 260
        }

        equation.hovered = isHoverComplete
      }

      setSnapshot([...equations])
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  if (snapshot.length === 0) return null

  return (
    <div ref={layersRef} className="floating-equations-layer" aria-hidden="true">
      {snapshot.map((equation) => {
        const isUnderlined = equation.underlineUntil > performance.now()

        return (
          <div
            key={equation.id}
            className={`floating-equation ${colorClassByTone[equation.color]} ${equation.hovered ? 'is-hovered' : ''} ${isUnderlined ? 'is-underlined' : ''}`}
            style={{
              transform: `translate(${equation.x + equation.hoverOffsetX}px, ${equation.y + equation.hoverOffsetY}px) scale(${equation.scale})`,
              opacity: equation.opacity,
              fontSize: `${equation.size}px`,
            }}
          >
            <span className="floating-equation-text">{equation.text}</span>
            {equation.hovered ? (
              <span className="floating-equation-tooltip">{equation.description}</span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default FloatingEquations
