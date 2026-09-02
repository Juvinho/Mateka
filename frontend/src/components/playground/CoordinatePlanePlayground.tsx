import { useMemo, useState } from 'react'

const VIEW_MIN = -10
const VIEW_MAX = 10

const CoordinatePlanePlayground = () => {
  const [xA, setXA] = useState(0)
  const [yA, setYA] = useState(0)
  const [xB, setXB] = useState(6)
  const [yB, setYB] = useState(8)

  const distance = useMemo(() => Math.sqrt((xB - xA) ** 2 + (yB - yA) ** 2), [xA, yA, xB, yB])
  const midpoint = useMemo(() => ({ x: (xA + xB) / 2, y: (yA + yB) / 2 }), [xA, yA, xB, yB])

  const clamp = (v: number) => Math.max(VIEW_MIN, Math.min(VIEW_MAX, v))

  return (
    <div className="coordinate-playground">
      <div className="coordinate-playground-controls">
        <div className="coordinate-playground-point-controls">
          <span className="coordinate-playground-point-label coordinate-playground-point-label--a">Ponto A</span>
          <div className="wave-slider-group">
            <span>xA</span>
            <input type="range" min={-10} max={10} step={1} value={xA} onChange={(e) => setXA(Number(e.target.value))} />
            <output>{xA}</output>
          </div>
          <div className="wave-slider-group">
            <span>yA</span>
            <input type="range" min={-10} max={10} step={1} value={yA} onChange={(e) => setYA(Number(e.target.value))} />
            <output>{yA}</output>
          </div>
        </div>

        <div className="coordinate-playground-point-controls">
          <span className="coordinate-playground-point-label coordinate-playground-point-label--b">Ponto B</span>
          <div className="wave-slider-group">
            <span>xB</span>
            <input type="range" min={-10} max={10} step={1} value={xB} onChange={(e) => setXB(Number(e.target.value))} />
            <output>{xB}</output>
          </div>
          <div className="wave-slider-group">
            <span>yB</span>
            <input type="range" min={-10} max={10} step={1} value={yB} onChange={(e) => setYB(Number(e.target.value))} />
            <output>{yB}</output>
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
        <line x1={clamp(xA)} y1={clamp(-yA)} x2={clamp(xB)} y2={clamp(-yB)} className="coordinate-playground-segment" />
        <circle cx={clamp(midpoint.x)} cy={clamp(-midpoint.y)} r={0.25} className="function-playground-vertex" />
        <circle cx={clamp(xA)} cy={clamp(-yA)} r={0.3} className="coordinate-playground-point coordinate-playground-point--a" />
        <circle cx={clamp(xB)} cy={clamp(-yB)} r={0.3} className="coordinate-playground-point coordinate-playground-point--b" />
      </svg>

      <div className="function-playground-readouts">
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Distância AB</span>
          <span className="function-playground-readout-value">{distance.toFixed(2)}</span>
        </div>
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Ponto médio</span>
          <span className="function-playground-readout-value">
            ({midpoint.x.toFixed(1)}, {midpoint.y.toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  )
}

export default CoordinatePlanePlayground
