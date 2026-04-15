import { useEffect, useMemo, useRef } from 'react'

import { clamp, lerp } from '../utils/math'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
}

const PARTICLE_COUNT = 80
const GRID_STEP = 40
const REPULSION_RADIUS = 120
const CONNECTION_DISTANCE = 100

const formulas = [
  '∫₀^π sin(x) dx = 2',
  'e^(iπ) + 1 = 0',
  'lim_{x→0} sin(x)/x = 1',
  "f'(x) = lim_{h→0} [f(x+h) - f(x)] / h",
  '∑_{n=1}^∞ 1/n² = π²/6',
  'd/dx[sin(x)] = cos(x)',
  '∇²φ = ρ/ε₀',
  '∮ E·dA = Q/ε₀',
  'θ = arctan(y/x)',
  'A = 1/2 ∫ r² dθ',
]

const formulaPositions = [
  { top: '11%', left: '6%', duration: '7.2s', delay: '0s' },
  { top: '18%', left: '67%', duration: '6.6s', delay: '0.6s' },
  { top: '28%', left: '33%', duration: '7.8s', delay: '1s' },
  { top: '37%', left: '72%', duration: '8.3s', delay: '0.8s' },
  { top: '45%', left: '10%', duration: '7.4s', delay: '1.2s' },
  { top: '56%', left: '52%', duration: '7s', delay: '0.2s' },
  { top: '63%', left: '17%', duration: '8s', delay: '0.4s' },
  { top: '73%', left: '66%', duration: '7.6s', delay: '1.4s' },
  { top: '80%', left: '36%', duration: '6.8s', delay: '0.3s' },
  { top: '86%', left: '7%', duration: '7.9s', delay: '0.9s' },
]

const randomInRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min

const MathBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const phaseRef = useRef(0)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const context = canvas.getContext('2d')
    if (!context) return

    const initializeParticles = (width: number, height: number): void => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomInRange(-0.22, 0.22),
        vy: randomInRange(-0.18, 0.18),
        radius: randomInRange(1, 3),
        color: Math.random() > 0.5 ? '#22d3ee' : '#6b21a8',
        alpha: randomInRange(0.3, 0.6),
      }))
    }

    const resize = (): void => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      initializeParticles(rect.width, rect.height)
    }

    const drawGrid = (width: number, height: number): void => {
      for (let x = 0; x <= width; x += GRID_STEP) {
        for (let y = 0; y <= height; y += GRID_STEP) {
          const dx = mouseRef.current.x - x
          const dy = mouseRef.current.y - y
          const distance = Math.hypot(dx, dy)
          const highlight = clamp(1 - distance / 180, 0, 1)
          const alpha = lerp(0.06, 0.28, highlight)
          const radius = lerp(1.4, 2.2, highlight)

          context.beginPath()
          context.fillStyle = `rgba(148,163,184,${alpha.toFixed(3)})`
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const drawDecorativeWave = (width: number, height: number): void => {
      context.beginPath()
      context.lineWidth = 1.6
      context.strokeStyle = 'rgba(34,211,238,0.04)'

      const baseline = height * 0.62
      const amplitude = 26
      const frequency = 0.011

      for (let x = 0; x <= width; x += 4) {
        const y = baseline + Math.sin(x * frequency + phaseRef.current) * amplitude
        if (x === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.stroke()
    }

    const drawParticles = (width: number, height: number): void => {
      const particles = particlesRef.current

      for (const particle of particles) {
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.hypot(dx, dy)

        if (distance < REPULSION_RADIUS && distance > 0.0001 && !reducedMotion) {
          const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS
          particle.vx += (dx / distance) * force * 0.04
          particle.vy += (dy / distance) * force * 0.04
        }

        if (!reducedMotion) {
          particle.x += particle.vx
          particle.y += particle.vy
        }

        particle.vx *= 0.985
        particle.vy *= 0.985

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1

        particle.x = clamp(particle.x, 0, width)
        particle.y = clamp(particle.y, 0, height)

        context.beginPath()
        context.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255)
          .toString(16)
          .padStart(2, '0')}`
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)

          if (distance > CONNECTION_DISTANCE) continue

          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.08
          context.beginPath()
          context.strokeStyle = `rgba(34,211,238,${opacity.toFixed(3)})`
          context.lineWidth = 1
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }
    }

    let frame = 0

    const render = (): void => {
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      context.clearRect(0, 0, width, height)

      drawGrid(width, height)
      drawDecorativeWave(width, height)
      drawParticles(width, height)

      if (!reducedMotion) {
        phaseRef.current += 0.008
      }

      frame = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent): void => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.x = event.clientX - rect.left
      mouseRef.current.y = event.clientY - rect.top
    }

    const onPointerLeave = (): void => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reducedMotion])

  return (
    <div ref={containerRef} className="math-background" aria-hidden="true">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Fundo matematico animado com particulas, formulas e onda senoidal"
      />

      <div className="math-formulas-layer">
        {formulas.map((formula, index) => (
          <span
            key={formula}
            className="math-floating-formula"
            style={formulaPositions[index]}
          >
            {formula}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MathBackground
