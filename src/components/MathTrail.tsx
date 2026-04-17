import { useEffect, useMemo, useRef } from 'react'

type MathTrailProps = {
  boostSymbols: boolean
}

type TrailParticle = {
  id: number
  x: number
  y: number
  size: number
  angle: number
  speedY: number
  symbol: string
  color: string
  bornAt: number
  lifetime: number
  opacity: number
  scale: number
}

const SYMBOLS = [
  '∫',
  '∑',
  'π',
  '∂',
  '∞',
  '√',
  'Δ',
  'θ',
  'λ',
  '∇',
  'dy',
  'dx',
  'f′',
  'lim',
  '∈',
  '≈',
  'sin',
  'cos',
  'tan',
  '∮',
  '∏',
  '∀',
  '∃',
]

const COLORS = ['#22d3ee', '#f472b6', '#a855f7']
const SPAWN_THROTTLE_MS = 80
const PARTICLE_LIFETIME_MS = 1200

const MathTrail = ({ boostSymbols }: MathTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<TrailParticle[]>([])
  const lastSpawnRef = useRef(0)
  const colorIndexRef = useRef(0)
  const idRef = useRef(0)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.01 }
    )
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const isTouch = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches,
    [],
  )

  useEffect(() => {
    if (reducedMotion || isTouch) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0

    const resize = (): void => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnParticle = (x: number, y: number): void => {
      const now = performance.now()
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return

      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] ?? '∑'
      const color = COLORS[colorIndexRef.current % COLORS.length] ?? '#22d3ee'
      colorIndexRef.current += 1
      lastSpawnRef.current = now

      particlesRef.current.push({
        id: idRef.current,
        x,
        y,
        size: 12 + Math.random() * 8,
        angle: Math.random() * Math.PI,
        speedY: Math.random() * 0.55,
        symbol,
        color,
        bornAt: now,
        lifetime: PARTICLE_LIFETIME_MS,
        opacity: 1,
        scale: 1,
      })

      idRef.current += 1
    }

    const onPointerMove = (event: PointerEvent): void => {
      spawnParticle(event.clientX, event.clientY)
    }

    const tick = (now: number): void => {
      frame = window.requestAnimationFrame(tick)
      if (!isVisibleRef.current) return

      const width = window.innerWidth
      const height = window.innerHeight
      context.clearRect(0, 0, width, height)

      const sizeBoost = boostSymbols ? 3 : 1

      particlesRef.current = particlesRef.current.filter((particle) => {
        const age = now - particle.bornAt
        const lifeProgress = age / particle.lifetime
        const opacity = 1 - lifeProgress
        const scale = 1 - lifeProgress * 0.4

        particle.y -= 0.6 + particle.speedY
        particle.x += (Math.random() - 0.5) * 0.4
        particle.angle += 0.02
        particle.opacity = opacity
        particle.scale = scale

        if (particle.opacity <= 0 || particle.scale <= 0) return false

        context.save()
        context.globalAlpha = particle.opacity
        context.translate(particle.x, particle.y)
        context.rotate(particle.angle)
        context.scale(particle.scale, particle.scale)
        context.fillStyle = particle.color
        context.font = `${Math.round(particle.size * sizeBoost)}px monospace`
        context.textAlign = 'center'
        context.fillText(particle.symbol, 0, 0)
        context.restore()

        return true
      })
    }

    resize()
    frame = window.requestAnimationFrame(tick)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      particlesRef.current = []
    }
  }, [boostSymbols, isTouch, reducedMotion])

  if (reducedMotion || isTouch) return null

  return <canvas ref={canvasRef} className="math-trail-layer" aria-hidden="true" />
}

export default MathTrail
