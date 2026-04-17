import { useEffect, useMemo, useRef } from 'react'

type BackgroundCanvasProps = {
  ambienceActive: boolean
  intensityBoost?: number
}

type GridRipple = {
  x: number
  y: number
  startedAt: number
}

type Shockwave = {
  x: number
  y: number
  radius: number
  opacity: number
  life: number
}

type DataStream = {
  x: number
  y: number
  speed: number
  spacing: number
  glyphs: string[]
}

type Orb = {
  baseX: number
  baseY: number
  baseRadius: number
  orbitRadius: number
  speed: number
  phase: number
  rgb: string
  baseOpacity: number
  burst: number
  opacityLerp: number
}

type MathParticle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  symbol: string
  rgb: string
  angle: number
  direction: number
}

const GRID_SPACING = 48
const CURSOR_INFLUENCE_RADIUS = 200
const GRID_RIPPLE_DURATION = 1500
const SHOCKWAVE_MAX_LIFE = 60
const SHOCKWAVE_DELAY_FRAMES = 8

const STREAM_SYMBOLS = ['0', '1', '∫', '∑', 'π', 'Δ', '∂', '√', '∞', 'θ', 'λ', 'α', 'β', '∇']
const PARTICLE_SYMBOLS = ['∫', '∑', 'π', '∂', '∞', '√', 'Δ', 'θ', 'λ', '∇', '∈', '≈', '±', "f'", 'dx', 'lim']
const PARTICLE_COLORS = ['34,211,238', '109,40,217', '244,114,182']

const randomBetween = (min: number, max: number): number => Math.random() * (max - min) + min
const randomInt = (min: number, max: number): number => Math.floor(randomBetween(min, max + 1))
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value))
const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount

const pick = <T,>(items: T[]): T => {
  const item = items[Math.floor(Math.random() * items.length)]
  return item ?? items[0]
}

const shouldIgnoreShockwaveClick = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      'button, a, input, select, textarea, label, [role="button"], [data-cursor], [data-no-shockwave]'
    ),
  )
}

const createStreamGlyphs = (): string[] => {
  const count = randomInt(4, 10)
  return Array.from({ length: count }, () => pick(STREAM_SYMBOLS))
}

const BackgroundCanvas = ({ ambienceActive, intensityBoost = 0 }: BackgroundCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const sizeRef = useRef({ width: 0, height: 0 })
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })

  const ripplesRef = useRef<GridRipple[]>([])
  const shockwavesRef = useRef<Shockwave[]>([])
  const streamsRef = useRef<DataStream[]>([])
  const orbsRef = useRef<Orb[]>([])
  const particlesRef = useRef<MathParticle[]>([])

  const scrollRef = useRef({ lastY: 0, speed: 0, driftMultiplier: 1 })

  const intensityRef = useRef(0)
  const targetIntensityRef = useRef(0)
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

  const coarsePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches,
    [],
  )

  const liteMode = reducedMotion || coarsePointer

  useEffect(() => {
    const base = ambienceActive ? 1 : 0
    targetIntensityRef.current = clamp(base + intensityBoost, 0, 1.8)
  }, [ambienceActive, intensityBoost])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let initFrameA = 0
    let initFrameB = 0

    const createStreams = (width: number, height: number): DataStream[] => {
      if (liteMode) return []

      return Array.from({ length: 8 }, () => ({
        x: randomBetween(0, width + 200),
        y: randomBetween(28, Math.max(32, height - 28)),
        speed: randomBetween(0.3, 1.2),
        spacing: randomBetween(8, 11),
        glyphs: createStreamGlyphs(),
      }))
    }

    const createOrbs = (width: number, height: number): Orb[] => {
      return [
        {
          baseX: width * 0.2,
          baseY: height * 0.18,
          baseRadius: 240,
          orbitRadius: 120,
          speed: 0.00045,
          phase: 0,
          rgb: '34,211,238',
          baseOpacity: 0.06,
          burst: 0,
          opacityLerp: 0.06,
        },
        {
          baseX: width * 0.82,
          baseY: height * 0.28,
          baseRadius: 260,
          orbitRadius: 160,
          speed: 0.00033,
          phase: 1.8,
          rgb: '109,40,217',
          baseOpacity: 0.07,
          burst: 0,
          opacityLerp: 0.07,
        },
        {
          baseX: width * 0.72,
          baseY: height * 0.78,
          baseRadius: 210,
          orbitRadius: 130,
          speed: 0.00052,
          phase: 3.2,
          rgb: '244,114,182',
          baseOpacity: 0.05,
          burst: 0,
          opacityLerp: 0.05,
        },
        {
          baseX: width * 0.35,
          baseY: height * 0.7,
          baseRadius: 190,
          orbitRadius: 90,
          speed: 0.00077,
          phase: 4.6,
          rgb: '34,211,238',
          baseOpacity: 0.04,
          burst: 0,
          opacityLerp: 0.04,
        },
      ]
    }

    const createParticles = (width: number, height: number): MathParticle[] => {
      const count = liteMode ? 12 : 25
      return Array.from({ length: count }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.08, 0.08),
        vy: randomBetween(-0.08, 0.08),
        size: randomBetween(11, 22),
        alpha: randomBetween(0.04, 0.09),
        symbol: pick(PARTICLE_SYMBOLS),
        rgb: pick(PARTICLE_COLORS),
        angle: randomBetween(0, Math.PI * 2),
        direction: Math.random() > 0.5 ? 1 : -1,
      }))
    }

    const resizeCanvas = (): void => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { width, height }

      streamsRef.current = createStreams(width, height)
      orbsRef.current = createOrbs(width, height)
      particlesRef.current = createParticles(width, height)
    }

    const drawGrid = (timeMs: number, currentIntensity: number): void => {
      const { width, height } = sizeRef.current
      const mouse = mouseRef.current

      ripplesRef.current = ripplesRef.current.filter(
        (ripple) => timeMs - ripple.startedAt < GRID_RIPPLE_DURATION,
      )

      const pulseSpeed = 1.2 * (1 + currentIntensity * 0.3)
      const opacityPulseSpeed = 0.8 * (1 + currentIntensity * 0.3)

      for (let y = 0; y <= height; y += GRID_SPACING) {
        const row = y / GRID_SPACING

        for (let x = 0; x <= width; x += GRID_SPACING) {
          const col = x / GRID_SPACING

          let radius = 1.2
          let opacity = 0.1

          if (!liteMode) {
            radius += 0.6 * Math.sin(timeMs * 0.001 * pulseSpeed + col * 0.4 + row * 0.4)
            opacity += 0.1 * Math.sin(timeMs * 0.001 * opacityPulseSpeed + col * 0.3 + row * 0.5)
          }

          if (mouse.active) {
            const dx = x - mouse.x
            const dy = y - mouse.y
            const distance = Math.hypot(dx, dy)
            const influence = Math.max(0, 1 - distance / CURSOR_INFLUENCE_RADIUS)
            radius += influence * 2.5
            opacity += influence * 0.3
          }

          for (const ripple of ripplesRef.current) {
            const dx = x - ripple.x
            const dy = y - ripple.y
            const distance = Math.hypot(dx, dy)
            const age = (timeMs - ripple.startedAt) / GRID_RIPPLE_DURATION
            const travelRadius = age * Math.max(width, height) * 1.15
            const bandDistance = Math.abs(distance - travelRadius)
            const ringInfluence = Math.max(0, 1 - bandDistance / 92)

            radius += ringInfluence * 2
            opacity += ringInfluence * 0.2
          }

          context.beginPath()
          context.arc(x, y, clamp(radius, 0.5, 4.8), 0, Math.PI * 2)
          context.fillStyle = `rgba(34,211,238,${clamp(opacity, 0.04, 0.8).toFixed(3)})`
          context.fill()
        }
      }
    }

    const drawStreams = (currentIntensity: number, streamBoost: number): void => {
      if (liteMode) return

      const { width, height } = sizeRef.current

      context.textBaseline = 'middle'
      context.textAlign = 'left'
      context.font = '10px "JetBrains Mono", monospace'

      for (const stream of streamsRef.current) {
        const speedFactor = (1 + currentIntensity * 0.3) * streamBoost
        stream.x -= stream.speed * speedFactor

        const streamLength = stream.glyphs.length * stream.spacing

        if (stream.x + streamLength < -20) {
          stream.x = width + randomBetween(20, 220)
          stream.y = randomBetween(24, Math.max(28, height - 24))
          stream.speed = randomBetween(0.3, 1.2)
          stream.spacing = randomBetween(8, 11)
          stream.glyphs = createStreamGlyphs()
        }

        for (let i = 0; i < stream.glyphs.length; i += 1) {
          const glyph = stream.glyphs[i]
          if (!glyph) continue

          const x = stream.x + i * stream.spacing
          if (x < -40 || x > width + 40) continue

          const alpha = randomBetween(0.03, 0.12) * (1 + currentIntensity)

          context.beginPath()
          context.moveTo(x - 3, stream.y)
          context.lineTo(x + 3, stream.y)
          context.strokeStyle = `rgba(34,211,238,${(alpha * 0.35).toFixed(3)})`
          context.lineWidth = 1
          context.stroke()

          context.fillStyle = `rgba(34,211,238,${clamp(alpha, 0.01, 0.24).toFixed(3)})`
          context.fillText(glyph, x, stream.y)
        }
      }
    }

    const drawOrbs = (timeMs: number, currentIntensity: number, scrollY: number): void => {
      const mouse = mouseRef.current

      for (const orb of orbsRef.current) {
        const orbitRadius = liteMode ? 0 : orb.orbitRadius * (1 + currentIntensity * 0.2)
        const orbitPhase = timeMs * orb.speed + orb.phase

        const x = orb.baseX + Math.cos(orbitPhase) * orbitRadius
        const y = orb.baseY + Math.sin(orbitPhase) * orbitRadius + scrollY * 0.03

        const pulseRadius = liteMode
          ? orb.baseRadius
          : orb.baseRadius + 40 * Math.sin(timeMs * 0.0004 + orb.phase)

        const mouseDistance = Math.hypot(x - mouse.x, y - mouse.y)
        let targetOpacity = orb.baseOpacity * (1 + currentIntensity * 0.4)

        if (mouse.active && mouseDistance < 400) {
          targetOpacity *= 1.4
        }

        orb.opacityLerp = lerp(orb.opacityLerp, targetOpacity, 0.05)
        orb.burst = lerp(orb.burst, 0, 0.12)

        const radius = pulseRadius * (1 + orb.burst)

        const gradient = context.createRadialGradient(x, y, 0, x, y, Math.max(1, radius))
        gradient.addColorStop(0, `rgba(${orb.rgb},${clamp(orb.opacityLerp, 0.01, 0.22).toFixed(3)})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        context.beginPath()
        context.fillStyle = gradient
        context.arc(x, y, Math.max(1, radius), 0, Math.PI * 2)
        context.fill()
      }
    }

    const drawParticles = (currentIntensity: number, driftMultiplier: number): void => {
      const { width, height } = sizeRef.current
      const mouse = mouseRef.current

      const speedMultiplier = (1 + currentIntensity * 0.5) * driftMultiplier

      for (const particle of particlesRef.current) {
        if (!liteMode && mouse.active) {
          const dx = particle.x - mouse.x
          const dy = particle.y - mouse.y
          const distance = Math.hypot(dx, dy)

          if (distance < 100 && distance > 0.001) {
            const force = ((100 - distance) / 100) * 0.8
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }

        particle.vx = clamp(particle.vx * 0.992, -1.5, 1.5)
        particle.vy = clamp(particle.vy * 0.992, -1.5, 1.5)

        particle.x += particle.vx * speedMultiplier
        particle.y += particle.vy * speedMultiplier

        particle.angle += 0.002 * particle.direction

        if (particle.x < -24) particle.x = width + 24
        if (particle.x > width + 24) particle.x = -24
        if (particle.y < -24) particle.y = height + 24
        if (particle.y > height + 24) particle.y = -24
      }

      if (!liteMode) {
        for (let i = 0; i < particlesRef.current.length; i += 1) {
          const a = particlesRef.current[i]
          if (!a) continue

          for (let j = i + 1; j < particlesRef.current.length; j += 1) {
            const b = particlesRef.current[j]
            if (!b) continue

            const dx = b.x - a.x
            const dy = b.y - a.y
            if (Math.abs(dx) > 160) continue
            if (Math.abs(dy) > 160) continue
            const distance = Math.hypot(dx, dy)

            if (distance > 160) continue

            const alpha = (1 - distance / 160) * 0.05

            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.strokeStyle = `rgba(34,211,238,${clamp(alpha, 0.01, 0.08).toFixed(3)})`
            context.lineWidth = 1
            context.stroke()
          }
        }
      }

      context.textAlign = 'center'
      context.textBaseline = 'middle'

      for (const particle of particlesRef.current) {
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.angle)
        context.font = `${particle.size}px "JetBrains Mono", monospace`
        context.fillStyle = `rgba(${particle.rgb},${clamp(particle.alpha * (1 + currentIntensity * 0.3), 0.02, 0.16).toFixed(3)})`
        context.fillText(particle.symbol, 0, 0)
        context.restore()
      }
    }

    const drawShockwaves = (): void => {
      for (let i = shockwavesRef.current.length - 1; i >= 0; i -= 1) {
        const wave = shockwavesRef.current[i]
        if (!wave) continue

        wave.radius += 6
        wave.opacity *= 0.93
        wave.life += 1 / SHOCKWAVE_MAX_LIFE

        context.beginPath()
        context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        context.strokeStyle = `rgba(34,211,238,${wave.opacity.toFixed(3)})`
        context.lineWidth = Math.max(0.5, 2 * (1 - wave.life))
        context.stroke()

        if (wave.life > SHOCKWAVE_DELAY_FRAMES / SHOCKWAVE_MAX_LIFE) {
          context.beginPath()
          context.arc(wave.x, wave.y, wave.radius * 0.7, 0, Math.PI * 2)
          context.strokeStyle = `rgba(244,114,182,${(wave.opacity * 0.6).toFixed(3)})`
          context.lineWidth = Math.max(0.5, 1.5 * (1 - wave.life))
          context.stroke()
        }

        if (wave.life >= 1 || wave.opacity < 0.01) {
          shockwavesRef.current.splice(i, 1)
        }
      }
    }

    const drawFrame = (timeMs: number): void => {
      rafRef.current = window.requestAnimationFrame(drawFrame)
      if (!isVisibleRef.current) return

      const { width, height } = sizeRef.current
      if (width < 2 || height < 2) {
        return
      }

      intensityRef.current = lerp(intensityRef.current, targetIntensityRef.current, 0.02)

      const scrollY = window.scrollY
      const rawScrollSpeed = scrollY - scrollRef.current.lastY
      scrollRef.current.lastY = scrollY
      scrollRef.current.speed = lerp(scrollRef.current.speed, rawScrollSpeed, 0.2)

      const driftTarget = 1 + Math.abs(scrollRef.current.speed) * 0.08
      scrollRef.current.driftMultiplier = lerp(scrollRef.current.driftMultiplier, driftTarget, 0.05)
      scrollRef.current.driftMultiplier = clamp(scrollRef.current.driftMultiplier, 1, 2.6)

      const streamBoost = 1 + Math.abs(scrollRef.current.speed) * 0.12

      context.clearRect(0, 0, width, height)

      drawGrid(timeMs, intensityRef.current)
      drawStreams(intensityRef.current, streamBoost)
      drawOrbs(timeMs, intensityRef.current, scrollY)
      drawParticles(intensityRef.current, scrollRef.current.driftMultiplier)
      drawShockwaves()
    }

    const startLoop = (): void => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(drawFrame)
    }

    const stopLoop = (): void => {
      if (rafRef.current === null) return
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
      mouseRef.current.active = true
    }

    const onPointerLeave = (): void => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
      mouseRef.current.active = false
    }

    const onPointerDown = (event: PointerEvent): void => {
      if (shouldIgnoreShockwaveClick(event.target)) return

      const x = event.clientX
      const y = event.clientY

      ripplesRef.current.push({ x, y, startedAt: performance.now() })
      shockwavesRef.current.push({ x, y, radius: 0, opacity: 0.6, life: 0 })

      let nearestOrb: Orb | null = null
      let nearestDistance = Number.POSITIVE_INFINITY

      for (const orb of orbsRef.current) {
        const dx = x - orb.baseX
        const dy = y - orb.baseY
        const distance = Math.hypot(dx, dy)

        if (distance >= nearestDistance) continue

        nearestDistance = distance
        nearestOrb = orb
      }

      if (!nearestOrb) return
      nearestOrb.burst = Math.max(nearestOrb.burst, 1)
    }

    const onVisibilityChange = (): void => {
      if (document.hidden) {
        stopLoop()
        return
      }

      scrollRef.current.lastY = window.scrollY
      startLoop()
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })

    resizeObserver.observe(document.documentElement)
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('visibilitychange', onVisibilityChange)

    resizeCanvas()
    scrollRef.current.lastY = window.scrollY

    initFrameA = window.requestAnimationFrame(() => {
      initFrameB = window.requestAnimationFrame(startLoop)
    })

    return () => {
      stopLoop()
      window.cancelAnimationFrame(initFrameA)
      window.cancelAnimationFrame(initFrameB)

      resizeObserver.disconnect()
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [liteMode])

  return <canvas ref={canvasRef} className="background-canvas" aria-hidden="true" />
}

export default BackgroundCanvas
