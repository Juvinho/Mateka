import { useMemo, useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { multiply, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[1, 2], [3, 4]]
const DEFAULT_B: Matrix = [[5, 6], [7, 8]]

const MultiplicationLab = () => {
  const [a, setA] = useState<Array<Array<number | null>>>(DEFAULT_A)
  const [b, setB] = useState<Array<Array<number | null>>>(DEFAULT_B)

  const matrixA: Matrix = a.map((row) => row.map((v) => v ?? 0))
  const matrixB: Matrix = b.map((row) => row.map((v) => v ?? 0))

  const product = useMemo(() => multiply(matrixA, matrixB), [matrixA, matrixB])

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite A e B:</p>
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
          <span className="matrix-display-label">B =</span>
          <MatrixGrid
            values={b}
            editableMask={b.map((row) => row.map(() => true))}
            onChange={(r, c, v) => setB((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next })}
          />
        </div>
        <span className="exercise-operator">=</span>
        <div className="matrix-display">
          <span className="matrix-display-label">A×B =</span>
          <MatrixGrid values={product} readOnly />
        </div>
      </div>
      <p className="matrix-lab-hint">Cada célula do resultado é uma linha de A multiplicada por uma coluna de B, somando os produtos.</p>
    </div>
  )
}

export default MultiplicationLab
