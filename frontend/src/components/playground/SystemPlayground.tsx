import { useMemo, useState } from 'react'
import { det2 } from '../../lib/matrixMath'

const VIEW_MIN = -10
const VIEW_MAX = 10
const SAMPLES = 80

function linePoints(a: number, b: number, c: number): string {
  const step = (VIEW_MAX - VIEW_MIN) / SAMPLES
  if (b !== 0) {
    const list: string[] = []
    for (let i = 0; i <= SAMPLES; i += 1) {
      const x = VIEW_MIN + i * step
      const y = (c - a * x) / b
      const clampedY = Math.max(VIEW_MIN, Math.min(VIEW_MAX, y))
      list.push(`${x},${-clampedY}`)
    }
    return list.join(' ')
  }
  if (a !== 0) {
    const x = Math.max(VIEW_MIN, Math.min(VIEW_MAX, c / a))
    return `${x},${VIEW_MIN} ${x},${VIEW_MAX}`
  }
  return ''
}

type Classification = { kind: 'SPD'; x: number; y: number } | { kind: 'SPI' } | { kind: 'SI' }

function classify(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Classification {
  const D = det2([[a1, b1], [a2, b2]])
  if (D !== 0) {
    const Dx = det2([[c1, b1], [c2, b2]])
    const Dy = det2([[a1, c1], [a2, c2]])
    return { kind: 'SPD', x: Dx / D, y: Dy / D }
  }
  const Dx = det2([[c1, b1], [c2, b2]])
  const Dy = det2([[a1, c1], [a2, c2]])
  return Dx === 0 && Dy === 0 ? { kind: 'SPI' } : { kind: 'SI' }
}

const SystemPlayground = () => {
  const [a1, setA1] = useState(2)
  const [b1, setB1] = useState(1)
  const [c1, setC1] = useState(16)
  const [a2, setA2] = useState(1)
  const [b2, setB2] = useState(3)
  const [c2, setC2] = useState(23)

  const line1 = useMemo(() => linePoints(a1, b1, c1), [a1, b1, c1])
  const line2 = useMemo(() => linePoints(a2, b2, c2), [a2, b2, c2])
  const result = useMemo(() => classify(a1, b1, c1, a2, b2, c2), [a1, b1, c1, a2, b2, c2])

  return (
    <div className="system-playground">
      <div className="system-playground-equations">
        <p>{a1}x {b1 >= 0 ? '+' : '-'} {Math.abs(b1)}y = {c1}</p>
        <p>{a2}x {b2 >= 0 ? '+' : '-'} {Math.abs(b2)}y = {c2}</p>
      </div>

      <div className="system-playground-controls">
        <div className="system-playground-line-controls">
          <span className="system-playground-line-label">Reta 1</span>
          <div className="wave-slider-group">
            <span>a₁</span>
            <input type="range" min={-5} max={5} step={1} value={a1} onChange={(e) => setA1(Number(e.target.value))} />
            <output>{a1}</output>
          </div>
          <div className="wave-slider-group">
            <span>b₁</span>
            <input type="range" min={-5} max={5} step={1} value={b1} onChange={(e) => setB1(Number(e.target.value))} />
            <output>{b1}</output>
          </div>
          <div className="wave-slider-group">
            <span>c₁</span>
            <input type="range" min={-20} max={20} step={1} value={c1} onChange={(e) => setC1(Number(e.target.value))} />
            <output>{c1}</output>
          </div>
        </div>

        <div className="system-playground-line-controls">
          <span className="system-playground-line-label">Reta 2</span>
          <div className="wave-slider-group">
            <span>a₂</span>
            <input type="range" min={-5} max={5} step={1} value={a2} onChange={(e) => setA2(Number(e.target.value))} />
            <output>{a2}</output>
          </div>
          <div className="wave-slider-group">
            <span>b₂</span>
            <input type="range" min={-5} max={5} step={1} value={b2} onChange={(e) => setB2(Number(e.target.value))} />
            <output>{b2}</output>
          </div>
          <div className="wave-slider-group">
            <span>c₂</span>
            <input type="range" min={-20} max={20} step={1} value={c2} onChange={(e) => setC2(Number(e.target.value))} />
            <output>{c2}</output>
          </div>
        </div>
      </div>

      <svg
        className="function-playground-svg"
        viewBox={`${VIEW_MIN} ${VIEW_MIN} ${VIEW_MAX - VIEW_MIN} ${VIEW_MAX - VIEW_MIN}`}
        aria-hidden="true"
      >
        <line x1={VIEW_MIN} y1={0} x2={VIEW_MAX} y2={0} className="function-playground-axis" />
        <line x1={0} y1={VIEW_MIN} x2={0} y2={VIEW_MAX} className="function-playground-axis" />
        <polyline points={line1} className="system-playground-line1" />
        <polyline points={line2} className="system-playground-line2" />
        {result.kind === 'SPD' && (
          <circle
            cx={Math.max(VIEW_MIN, Math.min(VIEW_MAX, result.x))}
            cy={Math.max(VIEW_MIN, Math.min(VIEW_MAX, -result.y))}
            r={0.25}
            className="function-playground-vertex"
          />
        )}
      </svg>

      <div className="function-playground-readouts">
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Classificação</span>
          <span className="function-playground-readout-value">
            {result.kind === 'SPD' ? 'SPD' : result.kind === 'SPI' ? 'SPI' : 'SI'}
          </span>
        </div>
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Solução</span>
          <span className="function-playground-readout-value">
            {result.kind === 'SPD'
              ? `(${result.x.toFixed(2)}, ${result.y.toFixed(2)})`
              : result.kind === 'SPI'
                ? 'infinitas soluções'
                : 'nenhuma solução'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SystemPlayground
