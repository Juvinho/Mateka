import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { formatPiFraction, normalizeAngle, radToDeg } from '../utils/math'

const VIEWBOX_SIZE = 300
const CENTER = 140
const RADIUS = 120
const TAU = Math.PI * 2
const AUTO_ROTATE_SPEED = 0.8

type Point = {
  x: number
  y: number
}

const pointFromAngle = (angle: number, radius: number): Point => ({
  x: CENTER + radius * Math.cos(angle),
  y: CENTER - radius * Math.sin(angle),
})

const createArcPath = (start: number, end: number, radius: number): string => {
  const startPoint = pointFromAngle(start, radius)
  const endPoint = pointFromAngle(end, radius)
  const delta = normalizeAngle(end - start)
  const largeArcFlag = delta > Math.PI ? 1 : 0

  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endPoint.x} ${endPoint.y}`
}

const getQuadrant = (angle: number): number => Math.floor(normalizeAngle(angle) / (Math.PI / 2))

const TrigCircle = () => {
  const [angle, setAngle] = useState(Math.PI / 4)
  const [showTangent, setShowTangent] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [trail, setTrail] = useState<Point[]>([])
  const [powerCycle, setPowerCycle] = useState(0)
  const [badgeFlipKey, setBadgeFlipKey] = useState(0)

  const angleRef = useRef(angle)
  const quadrantRef = useRef(getQuadrant(angle))

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
    setTrail((previous) => [nextPoint, ...previous].slice(0, 12))

    const nextQuadrant = getQuadrant(nextAngle)
    if (nextQuadrant === quadrantRef.current) return

    quadrantRef.current = nextQuadrant
    setBadgeFlipKey((previous) => previous + 1)
  }, [])

  const normalizedAngle = normalizeAngle(angle)
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
    if (isHovering || reducedMotion) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number): void => {
      const deltaSeconds = (now - last) / 1000
      last = now
      applyAngle(angleRef.current + AUTO_ROTATE_SPEED * deltaSeconds)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [applyAngle, isHovering, reducedMotion])

  const onMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = ((event.clientX - rect.left) / rect.width) * VIEWBOX_SIZE
    const relativeY = ((event.clientY - rect.top) / rect.height) * VIEWBOX_SIZE

    const nextAngle = Math.atan2(CENTER - relativeY, relativeX - CENTER)
    applyAngle(nextAngle)
  }

  const handlePointerEnter = (): void => {
    setIsHovering(true)
    setPowerCycle((previous) => previous + 1)
  }

  const handlePointerLeave = (): void => {
    setIsHovering(false)
  }

  const autoMode = !isHovering && !reducedMotion

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
      >
        <button
          type="button"
          className="tangent-toggle"
          aria-label="Mostrar ou ocultar reta tangente"
          onClick={() => setShowTangent((previous) => !previous)}
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
            key={powerCycle}
            className={`trig-unit-circle ${isHovering ? 'is-powering' : ''}`}
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

          <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} stroke="#f8fafc" strokeWidth="2" />

          <line
            x1={point.x}
            y1={point.y}
            x2={point.x}
            y2={CENTER}
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1={CENTER}
            y1={point.y}
            x2={point.x}
            y2={point.y}
            stroke="#ec4899"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          <line
            className={autoMode ? 'trig-projection-line pulse-sin' : 'trig-projection-line'}
            x1={CENTER}
            y1={CENTER}
            x2={sinProjection.x}
            y2={sinProjection.y}
            stroke="#22d3ee"
            strokeWidth="2"
          />
          <line
            className={autoMode ? 'trig-projection-line pulse-cos' : 'trig-projection-line'}
            x1={CENTER}
            y1={CENTER}
            x2={cosProjection.x}
            y2={cosProjection.y}
            stroke="#ec4899"
            strokeWidth="2"
          />

          <path d={createArcPath(0, normalizedAngle, 36)} stroke="#7c3aed" strokeWidth="2" fill="none" />

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

          {trail.map((trailPoint, index) => {
            const factor = 1 - index / Math.max(1, trail.length)
            const radius = 0.5 + factor * 2.5
            const opacity = factor * 0.5

            return (
              <circle
                key={`${trailPoint.x}-${trailPoint.y}-${index}`}
                cx={trailPoint.x}
                cy={trailPoint.y}
                r={radius}
                fill={`rgba(34, 211, 238, ${opacity.toFixed(3)})`}
              />
            )
          })}

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

        <div key={badgeFlipKey} className="trig-tooltip trig-angle-badge" style={{ left: point.x + 10, top: point.y - 44 }}>
          {degrees}° | {radiansLabel} rad
        </div>
      </div>

      <div className="trig-values" aria-live="polite">
        <span className="sin">sin = {sinValue.toFixed(3)} ↑</span>
        <span className="cos">cos = {cosValue.toFixed(3)} →</span>
        <span className="tan">tan = {Number.isFinite(tanValue) ? tanValue.toFixed(3) : 'infinity'}</span>
      </div>
    </aside>
  )
}

export default TrigCircle
