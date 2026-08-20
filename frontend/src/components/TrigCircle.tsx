import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { formatPiFraction, normalizeAngle, radToDeg } from '../utils/math'

const VIEWBOX_SIZE = 300
const CENTER = 140
const RADIUS = 120
const TAU = Math.PI * 2
const TRAIL_LIMIT = 20
const AUTO_IDLE_MS = 2000
const EXPLOSION_LIFE_MS = 800

type Point = {
  x: number
  y: number
}

type ExplosionParticle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  opacity: number
  color: string
}

const pointFromAngle = (angle: number, radius: number): Point => ({
  x: CENTER + radius * Math.cos(angle),
  y: CENTER - radius * Math.sin(angle),
})

const createArcPathSigned = (angle: number, radius: number): string => {
  const startPoint = pointFromAngle(0, radius)
  const endPoint = pointFromAngle(angle, radius)
  const largeArcFlag = Math.abs(angle) > Math.PI ? 1 : 0
  const sweepFlag = angle >= 0 ? 0 : 1

  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}`
}

const toTrailColor = (index: number): string => {
  const ratio = index / Math.max(1, TRAIL_LIMIT - 1)
  const r = Math.round(34 + (244 - 34) * ratio)
  const g = Math.round(211 + (114 - 211) * ratio)
  const b = Math.round(238 + (182 - 238) * ratio)
  return `rgb(${r}, ${g}, ${b})`
}

const TrigCircle = () => {
  const [angle, setAngle] = useState(Math.PI / 4)
  const [showTangent, setShowTangent] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [trail, setTrail] = useState<Point[]>([pointFromAngle(Math.PI / 4, RADIUS)])
  const [pulseTime, setPulseTime] = useState(0)
  const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([])
  const [isCircleFlashing, setIsCircleFlashing] = useState(false)
  const [showExactValues, setShowExactValues] = useState(false)

  const angleRef = useRef(angle)
  const isHoveringRef = useRef(isHovering)
  const lastInteractionRef = useRef(performance.now())
  const particlesRef = useRef<ExplosionParticle[]>([])
  const particleIdRef = useRef(0)
  const exactValuesTimeoutRef = useRef<number | null>(null)
  const flashTimeoutRef = useRef<number | null>(null)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const applyAngle = useCallback((nextAngle: number): void => {
    angleRef.current = nextAngle
    setAngle(nextAngle)

    const nextPoint = pointFromAngle(nextAngle, RADIUS)
    setTrail((previous) => [nextPoint, ...previous].slice(0, TRAIL_LIMIT))
  }, [])

  useEffect(() => {
    isHoveringRef.current = isHovering
  }, [isHovering])

  const normalizedAngle = normalizeAngle(angle)
  const signedAngle = Math.atan2(Math.sin(angle), Math.cos(angle))

  const degrees = Math.round(radToDeg(normalizedAngle))
  const radiansLabel = formatPiFraction(normalizedAngle)

  const sinValue = Math.sin(angle)
  const cosValue = Math.cos(angle)
  const tanValue = Math.abs(cosValue) < 0.0001 ? Number.POSITIVE_INFINITY : sinValue / cosValue

  const point = pointFromAngle(angle, RADIUS)
  const sinProjection = { x: CENTER, y: point.y }
  const cosProjection = { x: point.x, y: CENTER }

  const tangentLine = useMemo(() => {
    const tangentDirection = {
      x: Math.sin(angle),
      y: Math.cos(angle),
    }

    const scale = 160

    return {
      x1: point.x - tangentDirection.x * scale,
      y1: point.y - tangentDirection.y * scale,
      x2: point.x + tangentDirection.x * scale,
      y2: point.y + tangentDirection.y * scale,
    }
  }, [angle, point.x, point.y])

  const miniPath = useMemo(() => {
    const width = 320
    const height = 80
    const midY = height / 2
    const amplitude = 23

    let path = ''
    for (let x = 0; x <= width; x += 2) {
      const theta = (x / width) * TAU * 2
      const y = midY - Math.sin(theta) * amplitude
      path += x === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    }

    return path
  }, [])

  const miniDot = useMemo(() => {
    const width = 320
    const height = 80
    const midY = height / 2
    const amplitude = 23
    const x = (normalizedAngle / TAU) * width
    const y = midY - Math.sin((x / width) * TAU * 2) * amplitude

    return { x, y }
  }, [normalizedAngle])

  useEffect(() => {
    let frame = 0

    const tick = (now: number): void => {
      setPulseTime(now / 1000)

      const isIdle = !isHoveringRef.current && now - lastInteractionRef.current > AUTO_IDLE_MS
      if (!reducedMotion && isIdle) {
        const speed = 0.012 + 0.006 * Math.sin((now / 1000) * 0.5)
        applyAngle(angleRef.current + speed)
      }

      setAutoMode(!reducedMotion && isIdle)

      if (particlesRef.current.length > 0) {
        const updatedParticles: ExplosionParticle[] = []

        for (const particle of particlesRef.current) {
          const nextLife = particle.life + 16
          const progress = nextLife / EXPLOSION_LIFE_MS
          if (progress >= 1) continue

          updatedParticles.push({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.97,
            vy: particle.vy * 0.97,
            life: nextLife,
            opacity: 1 - progress,
          })
        }

        particlesRef.current = updatedParticles
        setExplosionParticles(updatedParticles)
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [applyAngle, reducedMotion])

  useEffect(() => {
    return () => {
      if (exactValuesTimeoutRef.current) {
        window.clearTimeout(exactValuesTimeoutRef.current)
        exactValuesTimeoutRef.current = null
      }

      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current)
        flashTimeoutRef.current = null
      }
    }
  }, [])

  const onMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (reducedMotion) return

    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = ((event.clientX - rect.left) / rect.width) * VIEWBOX_SIZE
    const relativeY = ((event.clientY - rect.top) / rect.height) * VIEWBOX_SIZE

    const nextAngle = Math.atan2(CENTER - relativeY, relativeX - CENTER)
    applyAngle(nextAngle)
    lastInteractionRef.current = performance.now()
  }

  const handlePointerEnter = (): void => {
    setIsHovering(true)
    lastInteractionRef.current = performance.now()
  }

  const handlePointerLeave = (): void => {
    setIsHovering(false)
    lastInteractionRef.current = performance.now()
  }

  const handleCircleClick = (): void => {
    if (reducedMotion) return

    const colors = ['#22d3ee', '#f472b6', '#a855f7']
    const particles: ExplosionParticle[] = Array.from({ length: 8 }, (_, index) => {
      const direction = (index / 8) * TAU
      const speed = 2.2 + Math.random() * 1.1

      return {
        id: particleIdRef.current + index,
        x: point.x,
        y: point.y,
        vx: Math.cos(direction) * speed,
        vy: -Math.sin(direction) * speed,
        radius: 2 + Math.random() * 1.8,
        life: 0,
        opacity: 1,
        color: colors[index % colors.length] ?? '#22d3ee',
      }
    })

    particleIdRef.current += 8
    particlesRef.current = particles
    setExplosionParticles(particles)

    setIsCircleFlashing(true)
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current)
    }
    flashTimeoutRef.current = window.setTimeout(() => {
      setIsCircleFlashing(false)
      flashTimeoutRef.current = null
    }, 300)

    setShowExactValues(true)
    if (exactValuesTimeoutRef.current) {
      window.clearTimeout(exactValuesTimeoutRef.current)
    }
    exactValuesTimeoutRef.current = window.setTimeout(() => {
      setShowExactValues(false)
      exactValuesTimeoutRef.current = null
    }, 1500)
  }

  const projectionPulse = 0.4 + 0.3 * Math.sin(pulseTime * 2)
  const thetaLabelPoint = pointFromAngle(signedAngle * 0.5, 42)

  return (
    <aside className="trig-panel" aria-label="Painel interativo de trigonometria">
      <div className="trig-mini-chart" aria-hidden="true">
        <svg viewBox="0 0 320 80" role="img" aria-label="Mini gráfico da função seno">
          <defs>
            <linearGradient id="miniArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.38)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          <path d={`${miniPath} L 320 80 L 0 80 Z`} fill="url(#miniArea)" />
          <path d={miniPath} fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx={miniDot.x} cy={miniDot.y} r="5" fill="#f97316" />
        </svg>
        <span>f(x) = sin(x)</span>
      </div>

      <div
        className={`trig-circle-area ${autoMode ? 'is-auto' : ''}`}
        onPointerMove={onMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleCircleClick}
      >
        <button
          type="button"
          className="tangent-toggle"
          aria-label="Mostrar ou ocultar reta tangente"
          onClick={(event) => {
            event.stopPropagation()
            setShowTangent((previous) => !previous)
          }}
          data-cursor
        >
          {showTangent ? 'Tangente: ON' : 'Tangente: OFF'}
        </button>

        <svg
          viewBox="0 0 300 300"
          role="img"
          aria-label="Círculo trigonométrico interativo com seno, cosseno, tangente e ângulo"
        >
          <line x1="20" y1={CENTER} x2="280" y2={CENTER} stroke="#1e293b" strokeWidth="1.4" />
          <line x1={CENTER} y1="20" x2={CENTER} y2="280" stroke="#1e293b" strokeWidth="1.4" />

          <circle
            className={`trig-unit-circle ${isCircleFlashing ? 'is-flashing' : ''}`}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />

          <text x="22" y={CENTER - 6} className="axis-label">
            -1
          </text>
          <text x="274" y={CENTER - 6} className="axis-label">
            1
          </text>
          <text x={CENTER + 6} y="28" className="axis-label">
            1
          </text>
          <text x={CENTER + 6} y="280" className="axis-label">
            -1
          </text>
          <text x={CENTER + 6} y={CENTER - 6} className="axis-label">
            0
          </text>

          {trail.map((trailPoint, index) => {
            const factor = 1 - index / TRAIL_LIMIT
            const radius = 4 * factor
            const opacity = 0.5 * factor

            return (
              <circle
                key={`${trailPoint.x}-${trailPoint.y}-${index}`}
                cx={trailPoint.x}
                cy={trailPoint.y}
                r={Math.max(0.6, radius)}
                fill={toTrailColor(index)}
                fillOpacity={Math.max(0, opacity)}
              />
            )
          })}

          <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} stroke="#f8fafc" strokeWidth="2" />

          <line
            x1={point.x}
            y1={point.y}
            x2={point.x}
            y2={CENTER}
            stroke="#22d3ee"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            strokeOpacity={projectionPulse}
          />
          <line
            x1={CENTER}
            y1={point.y}
            x2={point.x}
            y2={point.y}
            stroke="#ec4899"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            strokeOpacity={projectionPulse}
          />

          <line
            className="trig-projection-line"
            x1={CENTER}
            y1={CENTER}
            x2={sinProjection.x}
            y2={sinProjection.y}
            stroke="#22d3ee"
            strokeWidth="2"
          />
          <line
            className="trig-projection-line"
            x1={CENTER}
            y1={CENTER}
            x2={cosProjection.x}
            y2={cosProjection.y}
            stroke="#ec4899"
            strokeWidth="2"
          />

          <path d={createArcPathSigned(signedAngle, 28)} stroke="rgba(168,85,247,0.8)" strokeWidth="2" fill="none" />
          <text x={thetaLabelPoint.x - 6} y={thetaLabelPoint.y - 6} className="angle-label">
            θ
          </text>

          {showTangent ? (
            <line
              x1={tangentLine.x1}
              y1={tangentLine.y1}
              x2={tangentLine.x2}
              y2={tangentLine.y2}
              stroke="#eab308"
              strokeWidth="1.8"
            />
          ) : null}

          {explosionParticles.map((particle) => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill={particle.color}
              fillOpacity={particle.opacity}
            />
          ))}

          <circle cx={point.x} cy={point.y} r="9" fill="rgba(34,211,238,0.2)" />
          <circle
            cx={point.x}
            cy={point.y}
            r="7"
            fill="#22d3ee"
            stroke="#020617"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 9px rgba(34,211,238,0.7))' }}
          />
        </svg>

        <div className="trig-tooltip trig-angle-badge" style={{ left: point.x + 10, top: point.y - 44 }}>
          {degrees}° | {radiansLabel} rad
        </div>
      </div>

      {showExactValues ? (
        <div className="trig-exact-values" aria-live="polite">
          sen(θ) = {sinValue.toFixed(2)} | cos(θ) = {cosValue.toFixed(2)} | tan(θ) ={' '}
          {Number.isFinite(tanValue) ? tanValue.toFixed(2) : '∞'}
        </div>
      ) : null}

      <div className="trig-values" aria-live="polite">
        <span className="sin">sin = {sinValue.toFixed(3)} ↑</span>
        <span className="cos">cos = {cosValue.toFixed(3)} →</span>
        <span className="tan">tan = {Number.isFinite(tanValue) ? tanValue.toFixed(3) : 'infinity'}</span>
      </div>
    </aside>
  )
}

export default TrigCircle
