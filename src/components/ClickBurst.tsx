import { useEffect, useMemo, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  symbol: string
  color: string
  size: number
  bornAt: number
  lifetime: number
  rotation: number
  rotSpeed: number
}

type Ring = {
  x: number
  y: number
  bornAt: number
  lifetime: number
  hue: string
}

const SYMBOLS = ['∫', '∑', 'π', '∂', '∞', '√', 'Δ', 'θ', 'λ', '∇', '≈', '±', '⊕', '⊗', 'φ', 'ψ']
const COLORS = ['#22d3ee', '#f472b6', '#a855f7', '#22d3ee', '#fbbf24']

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] ?? arr[0]

const shouldIgnore = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      'input, select, textarea, [data-no-burst]',
    ),
  )
}

const ClickBurst = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const ringsRef = useRef<Ring[]>([])
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

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = (): void => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const onClick = (event: MouseEvent): void => {
      if (shouldIgnore(event.target)) return

      const now = performance.now()
      const count = 12 + Math.floor(Math.random() * 6)

      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
        const speed = 2 + Math.random() * 4
        particlesRef.current.push({
          x: event.clientX,
          y: event.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          symbol: pick(SYMBOLS),
          color: pick(COLORS),
          size: 14 + Math.random() * 10,
          bornAt: now,
          lifetime: 900 + Math.random() * 400,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.18,
        })
      }

      ringsRef.current.push({
        x: event.clientX,
        y: event.clientY,
        bornAt: now,
        lifetime: 700,
        hue: pick(['34, 211, 238', '244, 114, 182', '168, 85, 247']),
      })
    }

    let frame = 0

    const tick = (now: number): void => {
      frame = window.requestAnimationFrame(tick)
      if (!isVisibleRef.current) return

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Rings
      ringsRef.current = ringsRef.current.filter((ring) => {
        const age = now - ring.bornAt
        const progress = age / ring.lifetime
        if (progress >= 1) return false

        const radius = progress * 140
        const alpha = (1 - progress) * 0.85
        ctx.strokeStyle = `rgba(${ring.hue}, ${alpha})`
        ctx.lineWidth = Math.max(0.5, (1 - progress) * 2.2)
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2)
        ctx.stroke()

        return true
      })

      // Particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        const age = now - particle.bornAt
        const progress = age / particle.lifetime
        if (progress >= 1) return false

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.96
        particle.vy *= 0.96
        particle.vy += 0.08 // gravity
        particle.rotation += particle.rotSpeed

        const alpha = 1 - progress
        const scale = 1 - progress * 0.3

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.scale(scale, scale)
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 12
        ctx.shadowColor = particle.color
        ctx.font = `700 ${particle.size}px "JetBrains Mono", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(particle.symbol, 0, 0)
        ctx.restore()

        return true
      })
    }

    frame = window.requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('click', onClick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      particlesRef.current = []
      ringsRef.current = []
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return <canvas ref={canvasRef} className="click-burst-layer" aria-hidden="true" />
}

export default ClickBurst
