import { useEffect, useMemo, useRef } from 'react'

const SYMBOLS = ['∫', '∑', 'π', '∂', '∞', '√', 'Δ', 'θ', 'λ', '∇', '∈', '≈', '±', '×', '÷']
const COLORS = ['#22d3ee', '#a855f7', '#f472b6']
const PARTICLE_COUNT = 60
const REPULSION_RADIUS = 120
const CONNECT_DISTANCE = 180

type SymbolParticle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  symbol: string
  color: string
  angle: number
  va: number
}

const randomBetween = (min: number, max: number): number => Math.random() * (max - min) + min

const pick = <T,>(values: T[]): T => {
  const value = values[Math.floor(Math.random() * values.length)]
  return value ?? values[0]
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<SymbolParticle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const frameRef = useRef<number | null>(null)
  const runningRef = useRef(true)

  const enabled = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const initializeParticles = (width: number, height: number): void => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.15, 0.15),
        vy: randomBetween(-0.15, 0.15),
        size: randomBetween(12, 28),
        alpha: randomBetween(0.04, 0.1),
        color: pick(COLORS),
        symbol: pick(SYMBOLS),
        angle: randomBetween(0, Math.PI * 2),
        va: randomBetween(-0.005, 0.005),
      }))
    }

    const resize = (): void => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      initializeParticles(width, height)
    }

    const draw = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight
      const particles = particlesRef.current

      context.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy)

          if (distance > CONNECT_DISTANCE) continue

          const opacity = (1 - distance / CONNECT_DISTANCE) * 0.06
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.strokeStyle = `rgba(34, 211, 238, ${opacity.toFixed(3)})`
          context.lineWidth = 1
          context.stroke()
        }
      }

      for (const particle of particles) {
        const toMouseX = particle.x - mouseRef.current.x
        const toMouseY = particle.y - mouseRef.current.y
        const distanceToMouse = Math.hypot(toMouseX, toMouseY)

        if (distanceToMouse < REPULSION_RADIUS && distanceToMouse > 0.001) {
          const force = (REPULSION_RADIUS - distanceToMouse) / REPULSION_RADIUS
          particle.vx += (toMouseX / distanceToMouse) * force * 0.08
          particle.vy += (toMouseY / distanceToMouse) * force * 0.08
        }

        particle.x += particle.vx
        particle.y += particle.vy
        particle.angle += particle.va

        particle.vx *= 0.992
        particle.vy *= 0.992

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.angle)
        context.font = `${particle.size}px "JetBrains Mono", monospace`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255)
          .toString(16)
          .padStart(2, '0')}`
        context.fillText(particle.symbol, 0, 0)
        context.restore()
      }
    }

    const loop = (): void => {
      if (!runningRef.current) return

      draw()
      frameRef.current = window.requestAnimationFrame(loop)
    }

    const startLoop = (): void => {
      if (!runningRef.current) {
        runningRef.current = true
      }

      if (frameRef.current) return

      frameRef.current = window.requestAnimationFrame(loop)
    }

    const stopLoop = (): void => {
      runningRef.current = false

      if (!frameRef.current) return

      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    const onPointerLeave = (): void => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        stopLoop()
        return
      }

      startLoop()
    }

    resize()
    startLoop()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stopLoop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled])

  if (!enabled) return null

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

export default ParticleField
