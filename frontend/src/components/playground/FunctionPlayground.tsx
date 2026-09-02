import { useMemo, useState } from 'react'

const VIEW_MIN = -10
const VIEW_MAX = 10
const SAMPLES = 80

const FunctionPlayground = () => {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)

  const points = useMemo(() => {
    const step = (VIEW_MAX - VIEW_MIN) / SAMPLES
    const list: string[] = []
    for (let i = 0; i <= SAMPLES; i += 1) {
      const x = VIEW_MIN + i * step
      const y = a * x * x + b * x + c
      const clampedY = Math.max(VIEW_MIN, Math.min(VIEW_MAX, y))
      list.push(`${x},${-clampedY}`)
    }
    return list.join(' ')
  }, [a, b, c])

  const discriminant = b * b - 4 * a * c
  const hasRealRoots = a !== 0 && discriminant >= 0
  const roots = hasRealRoots
    ? [(-b + Math.sqrt(discriminant)) / (2 * a), (-b - Math.sqrt(discriminant)) / (2 * a)]
    : null

  const vertexX = a !== 0 ? -b / (2 * a) : null
  const vertexY = vertexX !== null ? a * vertexX * vertexX + b * vertexX + c : null

  return (
    <div className="function-playground">
      <p className="function-playground-label">
        f(x) = {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)}
      </p>

      <div className="function-playground-controls">
        <div className="wave-slider-group">
          <span>a</span>
          <input type="range" min={-5} max={5} step={0.5} value={a} onChange={(e) => setA(Number(e.target.value))} />
          <output>{a}</output>
        </div>
        <div className="wave-slider-group">
          <span>b</span>
          <input type="range" min={-10} max={10} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} />
          <output>{b}</output>
        </div>
        <div className="wave-slider-group">
          <span>c</span>
          <input type="range" min={-10} max={10} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
          <output>{c}</output>
        </div>
      </div>

      <svg
        className="function-playground-svg"
        viewBox={`${VIEW_MIN} ${VIEW_MIN} ${VIEW_MAX - VIEW_MIN} ${VIEW_MAX - VIEW_MIN}`}
        aria-hidden="true"
      >
        <line x1={VIEW_MIN} y1={0} x2={VIEW_MAX} y2={0} className="function-playground-axis" />
        <line x1={0} y1={VIEW_MIN} x2={0} y2={VIEW_MAX} className="function-playground-axis" />
        <polyline points={points} className="function-playground-curve" />
        {vertexX !== null && vertexY !== null && (
          <circle
            cx={Math.max(VIEW_MIN, Math.min(VIEW_MAX, vertexX))}
            cy={Math.max(VIEW_MIN, Math.min(VIEW_MAX, -vertexY))}
            r={0.25}
            className="function-playground-vertex"
          />
        )}
      </svg>

      <div className="function-playground-readouts">
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Vértice</span>
          <span className="function-playground-readout-value">
            {vertexX !== null && vertexY !== null ? `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` : '—'}
          </span>
        </div>
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Raízes reais</span>
          <span className="function-playground-readout-value">
            {roots ? `x = ${roots[0].toFixed(2)} ou x = ${roots[1].toFixed(2)}` : 'nenhuma raiz real'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FunctionPlayground
