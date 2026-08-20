import { useMemo, useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { scalarMul, sub, sum, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[1, 2], [3, 4]]
const DEFAULT_B: Matrix = [[5, 6], [7, 8]]

const editableGrid = (values: Array<Array<number | null>>, onChange: (r: number, c: number, v: number | null) => void) => (
  <MatrixGrid
    values={values}
    editableMask={values.map((row) => row.map(() => true))}
    onChange={onChange}
  />
)

const OperationsLab = () => {
  const [a, setA] = useState<Array<Array<number | null>>>(DEFAULT_A)
  const [b, setB] = useState<Array<Array<number | null>>>(DEFAULT_B)
  const [k, setK] = useState(2)

  const matrixA: Matrix = a.map((row) => row.map((v) => v ?? 0))
  const matrixB: Matrix = b.map((row) => row.map((v) => v ?? 0))

  const { plus, minus, scaled } = useMemo(
    () => ({ plus: sum(matrixA, matrixB), minus: sub(matrixA, matrixB), scaled: scalarMul(k, matrixA) }),
    [matrixA, matrixB, k],
  )

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite A, B e k:</p>
      <div className="matrix-lab-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A =</span>
          {editableGrid(a, (r, c, v) => setA((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next }))}
        </div>
        <div className="matrix-display">
          <span className="matrix-display-label">B =</span>
          {editableGrid(b, (r, c, v) => setB((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next }))}
        </div>
        <label className="matrix-lab-scalar">
          k =
          <input type="number" inputMode="decimal" value={k} onChange={(e) => setK(e.target.value === '' ? 0 : Number(e.target.value))} />
        </label>
      </div>

      <div className="matrix-lab-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A + B =</span>
          <MatrixGrid values={plus} readOnly />
        </div>
        <div className="matrix-display">
          <span className="matrix-display-label">A − B =</span>
          <MatrixGrid values={minus} readOnly />
        </div>
        <div className="matrix-display">
          <span className="matrix-display-label">k·A =</span>
          <MatrixGrid values={scaled} readOnly />
        </div>
      </div>
      <p className="matrix-lab-hint">Os três resultados recalculam a cada tecla — mude A, B ou k e veja tudo se ajustar.</p>
    </div>
  )
}

export default OperationsLab
