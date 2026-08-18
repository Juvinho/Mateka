import { useEffect, useMemo, useRef } from 'react'

import { lerp } from '../utils/math'

type LoginBackgroundProps = {
  intensity?: number
}

type Radar = {
  startedAt: number
  duration: number
}

type GhostEquation = {
  text: string
  x: number
  y: number
  drift: number
  phase: number
  size: number
  currentOpacity: number
}

const GHOST_EQUATIONS = [
  'e^(iπ) + 1 = 0',
  '∫₀^∞ e^(-x²)dx = √π/2',
  '∇²φ = 0',
  "f'(x) = lim Δx→0",
  '∑(1/n²) = π²/6',
  'sin²θ + cos²θ = 1',
  'F = ma',
  'det(A) = εᵢⱼₖ aᵢ',
  'dy/dx = f(x,y)',
  'lim x→∞ 1/x = 0',
  'σ² = E[(X-μ)²]',
  '⟨ψ|Ĥ|ψ⟩',
]

const VECTOR_COLS = 20
const VECTOR_ROWS = 20

const LoginBackground = ({ intensity = 1 }: LoginBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999 })
  const radarsRef = useRef<Radar[]>([])
  const equationsRef = useRef<GhostEquation[]>([])
  const lastRadarRef = useRef(0)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    const height = window.innerHeight
    equationsRef.current = GHOST_EQUATIONS.map((text, idx) => ({
      text,
      x: Math.random() * width,
      y: Math.random() * height,
      drift: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2 + idx,
      size: 12 + Math.random() * 6,
      currentOpacity: 0.04,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const onResize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    onResize()

    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current.tx = event.clientX
      mouseRef.current.ty = event.clientY
    }

    const onPointerLeave = (): void => {
      mouseRef.current.tx = window.innerWidth / 2
      mouseRef.current.ty = window.innerHeight / 2
    }

    mouseRef.current.x = window.innerWidth / 2
    mouseRef.current.y = window.innerHeight / 2
    mouseRef.current.tx = window.innerWidth / 2
    mouseRef.current.ty = window.innerHeight / 2

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    let frame = 0

    const drawArrow = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
    ): void => {
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()

      const angle = Math.atan2(toY - fromY, toX - fromX)
      const head = 4
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(toX - head * Math.cos(angle - Math.PI / 7), toY - head * Math.sin(angle - Math.PI / 7))
      ctx.lineTo(toX - head * Math.cos(angle + Math.PI / 7), toY - head * Math.sin(angle + Math.PI / 7))
      ctx.closePath()
      ctx.fill()
    }

    const tick = (now: number): void => {
      const width = window.innerWidth
      const height = window.innerHeight

      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.tx, 0.04)
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.ty, 0.04)

      ctx.clearRect(0, 0, width, height)

      // Layer 1: Polar radar rings
      if (now - lastRadarRef.current > 2500 && !reducedMotion) {
        radarsRef.current.push({ startedAt: now, duration: 7000 })
        lastRadarRef.current = now
      }

      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.hypot(width, height) * 0.6

      radarsRef.current = radarsRef.current.filter((radar) => {
        const elapsed = now - radar.startedAt
        const progress = elapsed / radar.duration
        if (progress >= 1) return false

        const radius = progress * maxRadius
        const alpha = (1 - progress) * 0.2 * intensity
        const lineWidth = Math.max(0.4, (1 - progress) * 1.4)

        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.3})`
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()

        return true
      })

      // Layer 2: Rotational vector field
      const vortexX = mouseRef.current.x
      const vortexY = mouseRef.current.y
      const cellW = width / VECTOR_COLS
      const cellH = height / VECTOR_ROWS

      ctx.strokeStyle = 'rgba(109, 40, 217, 0.22)'
      ctx.fillStyle = 'rgba(109, 40, 217, 0.32)'
      ctx.lineWidth = 1

      for (let col = 0; col < VECTOR_COLS; col += 1) {
        for (let row = 0; row < VECTOR_ROWS; row += 1) {
          const px = col * cellW + cellW / 2
          const py = row * cellH + cellH / 2

          const dx = px - vortexX
          const dy = py - vortexY

          // rotational field f(x,y) = (-y, x)
          const fx = -dy
          const fy = dx
          const mag = Math.hypot(fx, fy) + 0.0001

          const distance = Math.hypot(dx, dy)
          const falloff = Math.min(1, 240 / (distance + 60))
          const length = lerp(8, 20, Math.min(1, mag / 400)) * falloff

          const nx = fx / mag
          const ny = fy / mag

          drawArrow(px, py, px + nx * length, py + ny * length)
        }
      }

      // Layer 3: Ghost equations
      ctx.font = '600 14px "JetBrains Mono", monospace'
      for (const eq of equationsRef.current) {
        const dx = eq.x - mouseRef.current.x
        const dy = eq.y - mouseRef.current.y
        const distance = Math.hypot(dx, dy)

        const targetOpacity = distance < 150 ? lerp(0.18, 0.05, distance / 150) : 0.04
        eq.currentOpacity = lerp(eq.currentOpacity, targetOpacity, 0.08)

        if (!reducedMotion) {
          eq.x += Math.cos(now * 0.00008 + eq.phase) * eq.drift
          eq.y += Math.sin(now * 0.00009 + eq.phase) * eq.drift
          if (eq.x < -120) eq.x = width + 40
          if (eq.x > width + 120) eq.x = -40
          if (eq.y < -40) eq.y = height + 40
          if (eq.y > height + 40) eq.y = -40
        }

        ctx.fillStyle = `rgba(168, 220, 255, ${eq.currentOpacity})`
        ctx.font = `600 ${eq.size}px "JetBrains Mono", monospace`
        ctx.fillText(eq.text, eq.x, eq.y)
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [intensity, reducedMotion])

  return <canvas ref={canvasRef} className="login-background-canvas" aria-hidden="true" />
}

export default LoginBackground
