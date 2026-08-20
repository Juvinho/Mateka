import { useMemo } from 'react'

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
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  return (
    <div className="math-background" aria-hidden="true">
      <div className={`hero-orbs ${ambienceEnabled ? 'is-ambience' : ''}`}>
        <div className="hero-orb orb-cyan" />
        <div className="hero-orb orb-purple" />
        <div className="hero-orb orb-pink" />
      </div>

      <div className="hero-dot-grid" />

      <div className="math-formulas-layer">
        {formulas.map((formula, index) => (
          <span
            key={formula}
            className={`math-floating-formula ${reducedMotion ? 'is-static' : ''}`}
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
