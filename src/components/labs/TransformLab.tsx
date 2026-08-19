import { useMemo, useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { multiply, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[2, 0], [0, 2]]
const DEFAULT_P: Matrix = [[3], [1]]
const BOX = 220
const CENTER = BOX / 2

const TransformLab = () => {
  const [a, setA] = useState<Array<Array<number | null>>>(DEFAULT_A)
  const [p, setP] = useState<Array<Array<number | null>>>(DEFAULT_P)

  const matrixA: Matrix = a.map((row) => row.map((v) => v ?? 0))
  const matrixP: Matrix = p.map((row) => row.map((v) => v ?? 0))

  const result = useMemo(() => multiply(matrixA, matrixP), [matrixA, matrixP])

  const [px, py] = [matrixP[0][0], matrixP[1][0]]
  const [qx, qy] = [result[0][0], result[1][0]]

  const maxAbs = Math.max(1, Math.abs(px), Math.abs(py), Math.abs(qx), Math.abs(qy))
  const scale = 90 / maxAbs
  const toScreen = (x: number, y: number) => [CENTER + x * scale, CENTER - y * scale]
  const [px2, py2] = toScreen(px, py)
  const [qx2, qy2] = toScreen(qx, qy)

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite a matriz de transformação A e o ponto P:</p>
      <div className="matrix-lab-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A =</span>
          <MatrixGrid
            values={a}
            editableMask={a.map((row) => row.map(() => true))}
            onChange={(r, c, v) => setA((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next })}
          />
        </div>
        <span className="exercise-operator">×</span>
        <div className="matrix-display">
          <span className="matrix-display-label">P =</span>
          <MatrixGrid
            values={p}
            editableMask={p.map((row) => row.map(() => true))}
            onChange={(r, c, v) => setP((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next })}
          />
        </div>
        <span className="exercise-operator">=</span>
        <div className="matrix-display">
          <span className="matrix-display-label">P' =</span>
          <MatrixGrid values={result} readOnly />
        </div>
      </div>

      <div className="matrix-lab-row">
        <div className="matrix-lab-svg-wrap">
          <svg width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`} role="img" aria-label="Visualização do ponto antes e depois da transformação">
            <line x1={0} y1={CENTER} x2={BOX} y2={CENTER} stroke="rgba(148,163,184,0.3)" strokeWidth={1} />
            <line x1={CENTER} y1={0} x2={CENTER} y2={BOX} stroke="rgba(148,163,184,0.3)" strokeWidth={1} />

            <line x1={CENTER} y1={CENTER} x2={px2} y2={py2} stroke="#22d3ee" strokeWidth={2} />
            <circle cx={px2} cy={py2} r={5} fill="#22d3ee" />
            <text x={px2 + 8} y={py2 - 8} fill="#22d3ee" fontSize={12} fontFamily="JetBrains Mono, monospace">P</text>

            <line x1={CENTER} y1={CENTER} x2={qx2} y2={qy2} stroke="#f472b6" strokeWidth={2} />
            <circle cx={qx2} cy={qy2} r={5} fill="#f472b6" />
            <text x={qx2 + 8} y={qy2 - 8} fill="#f472b6" fontSize={12} fontFamily="JetBrains Mono, monospace">P'</text>
          </svg>
        </div>
      </div>
      <p className="matrix-lab-hint">
        <span style={{ color: '#22d3ee' }}>P</span> é o ponto original, <span style={{ color: '#f472b6' }}>P'</span> é P depois de multiplicado por A — mude A para rotacionar, escalar ou espelhar o ponto.
      </p>
    </div>
  )
}

export default TransformLab
