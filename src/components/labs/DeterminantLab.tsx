import { useMemo, useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { det3, trace, transpose, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 10]]

const DeterminantLab = () => {
  const [values, setValues] = useState<Array<Array<number | null>>>(DEFAULT_A)

  const matrix: Matrix = values.map((row) => row.map((v) => v ?? 0))

  const { tr, det, at } = useMemo(
    () => ({ tr: trace(matrix), det: det3(matrix), at: transpose(matrix) }),
    [matrix],
  )

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite A (3×3):</p>
      <div className="matrix-lab-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A =</span>
          <MatrixGrid
            values={values}
            editableMask={values.map((row) => row.map(() => true))}
            onChange={(r, c, v) => {
              setValues((prev) => { const next = prev.map((row) => row.slice()); next[r][c] = v; return next })
            }}
          />
        </div>
        <div className="matrix-lab-formula">
          <p>tr(A) = {tr}</p>
          <p>det(A) = {det}</p>
        </div>
        <div className="matrix-display">
          <span className="matrix-display-label">Aᵀ =</span>
          <MatrixGrid values={at} readOnly />
        </div>
      </div>
      <p className="matrix-lab-hint">Aᵀ troca linhas por colunas; tr(A) e det(A) recalculam a cada dígito que você digita.</p>
    </div>
  )
}

export default DeterminantLab
