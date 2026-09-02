import { useMemo, useState } from 'react'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

const FractionPlayground = () => {
  const [numerator, setNumerator] = useState(3)
  const [denominator, setDenominator] = useState(4)

  const clampedNumerator = Math.min(numerator, denominator)
  const ratio = clampedNumerator / denominator

  const { simplifiedNumerator, simplifiedDenominator } = useMemo(() => {
    if (clampedNumerator === 0) return { simplifiedNumerator: 0, simplifiedDenominator: 1 }
    const divisor = gcd(clampedNumerator, denominator)
    return {
      simplifiedNumerator: clampedNumerator / divisor,
      simplifiedDenominator: denominator / divisor,
    }
  }, [clampedNumerator, denominator])

  const isSimplified = simplifiedDenominator === denominator

  return (
    <div className="fraction-playground">
      <p className="fraction-playground-label">Ajuste o numerador e o denominador:</p>

      <div className="fraction-playground-controls">
        <div className="wave-slider-group">
          <span>Numerador</span>
          <input
            type="range"
            min={0}
            max={denominator}
            step={1}
            value={clampedNumerator}
            onChange={(event) => setNumerator(Number(event.target.value))}
          />
          <output>{clampedNumerator}</output>
        </div>

        <div className="wave-slider-group">
          <span>Denominador</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={denominator}
            onChange={(event) => setDenominator(Number(event.target.value))}
          />
          <output>{denominator}</output>
        </div>
      </div>

      <div className="fraction-playground-visuals">
        <div className="fraction-playground-pie-wrap">
          <div
            className="fraction-playground-pie"
            style={{
              background: `conic-gradient(#22d3ee ${ratio * 360}deg, rgba(148, 163, 184, 0.18) ${ratio * 360}deg 360deg)`,
            }}
            aria-hidden="true"
          />
          <span className="fraction-playground-fraction">
            {clampedNumerator}<hr />{denominator}
          </span>
        </div>

        <div className="fraction-playground-bar" aria-hidden="true">
          {Array.from({ length: denominator }, (_, index) => (
            <div
              key={index}
              className={`fraction-playground-bar-segment${index < clampedNumerator ? ' is-filled' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="fraction-playground-readouts">
        <div className="fraction-playground-readout">
          <span className="fraction-playground-readout-label">Decimal</span>
          <span className="fraction-playground-readout-value">{ratio.toFixed(3)}</span>
        </div>
        <div className="fraction-playground-readout">
          <span className="fraction-playground-readout-label">Porcentagem</span>
          <span className="fraction-playground-readout-value">{(ratio * 100).toFixed(1)}%</span>
        </div>
        <div className="fraction-playground-readout">
          <span className="fraction-playground-readout-label">Forma simplificada</span>
          <span className="fraction-playground-readout-value">
            {isSimplified ? 'já é irredutível' : `${simplifiedNumerator}/${simplifiedDenominator}`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FractionPlayground
