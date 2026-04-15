import { useEffect, useMemo, useRef } from 'react'

import { lerp } from '../utils/math'

type MathBackgroundProps = {
  ambienceEnabled: boolean
}

const formulas = [
  '∫_0^π sin(x) dx = 2',
  'e^(iπ) + 1 = 0',
  'lim_{x→0} sin(x)/x = 1',
  "f'(x) = lim_{h→0} [f(x+h)-f(x)]/h",
  'Σ_{n=1}^∞ 1/n^2 = π^2/6',
  'd/dx[sin(x)] = cos(x)',
  'θ = arctan(y/x)',
  'A = 1/2 ∫ r^2 dθ',
]

const formulaPositions = [
  { top: '8%', left: '8%', duration: '7.2s', delay: '0s' },
  { top: '16%', left: '66%', duration: '6.8s', delay: '0.5s' },
  { top: '26%', left: '34%', duration: '8.1s', delay: '1.1s' },
  { top: '38%', left: '70%', duration: '8.6s', delay: '0.8s' },
  { top: '53%', left: '12%', duration: '7.5s', delay: '1.2s' },
  { top: '62%', left: '53%', duration: '7.1s', delay: '0.3s' },
  { top: '74%', left: '20%', duration: '7.9s', delay: '0.7s' },
  { top: '84%', left: '63%', duration: '8.3s', delay: '1.4s' },
]

const MathBackground = ({ ambienceEnabled }: MathBackgroundProps) => {
  const orbsRef = useRef<HTMLDivElement | null>(null)
  const formulasRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const cyanOrbRef = useRef<HTMLDivElement | null>(null)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (reducedMotion) return

    const mouseTarget = { x: 0, y: 0 }
    const mouseCurrent = { x: 0, y: 0 }

    let orbShift = 0
    let formulaShift = 0
    let gridShift = 0
    let frame = 0

    const onPointerMove = (event: PointerEvent): void => {
      mouseTarget.x = (event.clientX - window.innerWidth / 2) * 0.05
      mouseTarget.y = (event.clientY - window.innerHeight / 2) * 0.05
    }

    const onPointerLeave = (): void => {
      mouseTarget.x = 0
      mouseTarget.y = 0
    }

    const tick = (): void => {
      const scrollY = window.scrollY
      const activeScroll = scrollY > window.innerHeight ? 0 : scrollY

      orbShift = lerp(orbShift, activeScroll * 0.4, 0.08)
      formulaShift = lerp(formulaShift, activeScroll * 0.25, 0.08)
      gridShift = lerp(gridShift, activeScroll * 0.5, 0.08)

      mouseCurrent.x = lerp(mouseCurrent.x, mouseTarget.x, 0.03)
      mouseCurrent.y = lerp(mouseCurrent.y, mouseTarget.y, 0.03)

      if (orbsRef.current) {
        orbsRef.current.style.transform = `translate3d(0, ${orbShift.toFixed(2)}px, 0)`
      }

      if (formulasRef.current) {
        formulasRef.current.style.transform = `translate3d(0, ${formulaShift.toFixed(2)}px, 0)`
      }

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${gridShift.toFixed(2)}px, 0)`
      }

      if (cyanOrbRef.current) {
        cyanOrbRef.current.style.setProperty('--orb-mouse-x', `${mouseCurrent.x.toFixed(2)}px`)
        cyanOrbRef.current.style.setProperty('--orb-mouse-y', `${mouseCurrent.y.toFixed(2)}px`)
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reducedMotion])

  return (
    <div className="math-background" aria-hidden="true">
      <div ref={orbsRef} className={`hero-orbs ${ambienceEnabled ? 'is-ambience' : ''}`}>
        <div ref={cyanOrbRef} className="hero-orb orb-cyan" />
        <div className="hero-orb orb-purple" />
        <div className="hero-orb orb-pink" />
      </div>

      <div ref={gridRef} className="hero-dot-grid" />

      <div ref={formulasRef} className="math-formulas-layer">
        {formulas.map((formula, index) => (
          <span key={formula} className="math-floating-formula" style={formulaPositions[index]}>
            {formula}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MathBackground
