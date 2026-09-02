import { useMemo, useState } from 'react'

const VIEW_SIZE = 22
const MAX_DIMENSION = 9

const CylinderPlayground = () => {
  const [radius, setRadius] = useState(3)
  const [height, setHeight] = useState(6)

  const volume = useMemo(() => Math.PI * radius * radius * height, [radius, height])
  const surfaceArea = useMemo(() => 2 * Math.PI * radius * radius + 2 * Math.PI * radius * height, [radius, height])

  // Scale to fit the viewBox regardless of slider values.
  const scale = Math.min(MAX_DIMENSION / (radius * 2), (MAX_DIMENSION * 1.4) / height)
  const rx = radius * scale
  const ry = rx * 0.35
  const bodyHeight = height * scale
  const topY = -bodyHeight / 2
  const bottomY = bodyHeight / 2

  return (
    <div className="cylinder-playground">
      <div className="cylinder-playground-controls">
        <div className="wave-slider-group">
          <span>Raio</span>
          <input type="range" min={1} max={10} step={1} value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
          <output>{radius}</output>
        </div>
        <div className="wave-slider-group">
          <span>Altura</span>
          <input type="range" min={1} max={10} step={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          <output>{height}</output>
        </div>
      </div>

      <svg
        className="function-playground-svg"
        viewBox={`${-VIEW_SIZE / 2} ${-VIEW_SIZE / 2} ${VIEW_SIZE} ${VIEW_SIZE}`}
        aria-hidden="true"
      >
        <rect
          x={-rx}
          y={topY}
          width={rx * 2}
          height={bodyHeight}
          className="cylinder-playground-body"
        />
        <ellipse cx={0} cy={bottomY} rx={rx} ry={ry} className="cylinder-playground-cap cylinder-playground-cap--bottom" />
        <ellipse cx={0} cy={topY} rx={rx} ry={ry} className="cylinder-playground-cap" />
      </svg>

      <div className="function-playground-readouts">
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Volume</span>
          <span className="function-playground-readout-value">{volume.toFixed(2)}</span>
        </div>
        <div className="function-playground-readout">
          <span className="function-playground-readout-label">Área total</span>
          <span className="function-playground-readout-value">{surfaceArea.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default CylinderPlayground
