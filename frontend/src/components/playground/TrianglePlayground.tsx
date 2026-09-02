import { useMemo, useState } from 'react'

const VIEW_MIN = -10
const VIEW_MAX = 10

type TriangleResult =
  | { valid: true; ax: number; ay: number; bx: number; by: number; cx: number; cy: number; perimeter: number; area: number }
  | { valid: false }

function computeTriangle(a: number, b: number, c: number): TriangleResult {
  // Triangle inequality: each side must be shorter than the sum of the other two.
  if (a + b <= c || a + c <= b || b + c <= a) return { valid: false }

  // A = (0,0), B = (c,0); solve for C using the law of cosines rearranged.
  const cx = (b * b - a * a + c * c) / (2 * c)
  const cySquared = b * b - cx * cx
  if (cySquared < 0) return { valid: false }
  const cy = Math.sqrt(cySquared)

  const perimeter = a + b + c
  const s = perimeter / 2
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

  return { valid: true, ax: 0, ay: 0, bx: c, by: 0, cx, cy, perimeter, area }
}

const TrianglePlayground = () => {
  const [sideA, setSideA] = useState(3)
  const [sideB, setSideB] = useState(4)
  const [sideC, setSideC] = useState(5)

  const result = useMemo(() => computeTriangle(sideA, sideB, sideC), [sideA, sideB, sideC])

  // Center the triangle in the viewBox for display.
  const offsetX = result.valid ? -(result.ax + result.bx + result.cx) / 3 : 0
  const offsetY = result.valid ? -(result.ay + result.by + result.cy) / 3 : 0
  const clamp = (v: number) => Math.max(VIEW_MIN, Math.min(VIEW_MAX, v))

  return (
    <div className="triangle-playground">
      <div className="triangle-playground-controls">
        <div className="wave-slider-group">
          <span>Lado a</span>
          <input type="range" min={1} max={10} step={1} value={sideA} onChange={(e) => setSideA(Number(e.target.value))} />
          <output>{sideA}</output>
        </div>
        <div className="wave-slider-group">
          <span>Lado b</span>
          <input type="range" min={1} max={10} step={1} value={sideB} onChange={(e) => setSideB(Number(e.target.value))} />
          <output>{sideB}</output>
        </div>
        <div className="wave-slider-group">
          <span>Lado c</span>
          <input type="range" min={1} max={10} step={1} value={sideC} onChange={(e) => setSideC(Number(e.target.value))} />
          <output>{sideC}</output>
        </div>
      </div>

      <svg
        className="function-playground-svg"
        viewBox={`${VIEW_MIN} ${VIEW_MIN} ${VIEW_MAX - VIEW_MIN} ${VIEW_MAX - VIEW_MIN}`}
        aria-hidden="true"
      >
        {result.valid ? (
          <polygon
            points={`${clamp(result.ax + offsetX)},${clamp(-result.ay - offsetY)} ${clamp(result.bx + offsetX)},${clamp(-result.by - offsetY)} ${clamp(result.cx + offsetX)},${clamp(-result.cy - offsetY)}`}
            className="triangle-playground-shape"
          />
        ) : null}
      </svg>

      {result.valid ? (
        <div className="function-playground-readouts">
          <div className="function-playground-readout">
            <span className="function-playground-readout-label">Perímetro</span>
            <span className="function-playground-readout-value">{result.perimeter.toFixed(2)}</span>
          </div>
          <div className="function-playground-readout">
            <span className="function-playground-readout-label">Área</span>
            <span className="function-playground-readout-value">{result.area.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <p className="triangle-playground-invalid">
          Triângulo inválido — um lado não pode ser maior ou igual à soma dos outros dois.
        </p>
      )}
    </div>
  )
}

export default TrianglePlayground
