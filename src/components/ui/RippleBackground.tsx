import { useEffect, useRef } from 'react'

type Ripple = {
  x: number
  y: number
  startTime: number
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const MAX_RIPPLES = 12
const RIPPLE_DURATION = 800
const RIPPLE_MAX_RADIUS = 120
const PARTICLE_COUNT = 40
const MAX_SPEED = 0.3

const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min)

const createParticles = (w: number, h: number): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: randomBetween(-MAX_SPEED, MAX_SPEED),
    vy: randomBetween(-MAX_SPEED, MAX_SPEED),
    radius: randomBetween(1, 2),
  }))

const RippleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(window.innerWidth, window.innerHeight)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const spawnRipple = (e: MouseEvent | TouchEvent) => {
      const isTouch = 'touches' in e
      const clientX = isTouch ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX
      const clientY = isTouch ? e.touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY

      const ripples = ripplesRef.current
      if (ripples.length >= MAX_RIPPLES) {
        ripples.shift()
      }
      ripples.push({ x: clientX, y: clientY, startTime: performance.now() })
    }

    window.addEventListener('click', spawnRipple)
    window.addEventListener('touchstart', spawnRipple, { passive: true })

    const draw = (now: number) => {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x += w
        if (p.x > w) p.x -= w
        if (p.y < 0) p.y += h
        if (p.y > h) p.y -= h

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34, 211, 238, 0.2)'
        ctx.fill()
      }

      ripplesRef.current = ripplesRef.current.filter((r) => {
        const elapsed = now - r.startTime
        if (elapsed >= RIPPLE_DURATION) return false

        const progress = elapsed / RIPPLE_DURATION
        const eased = 1 - Math.pow(1 - progress, 3)
        const radius = eased * RIPPLE_MAX_RADIUS
        const opacity = 0.6 * (1 - progress)

        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        return true
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', spawnRipple)
      window.removeEventListener('touchstart', spawnRipple)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}

export default RippleBackground
