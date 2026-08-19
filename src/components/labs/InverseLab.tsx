import { useMemo, useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { det2, inverse2, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[4, 7], [2, 6]]

const InverseLab = () => {
  const [values, setValues] = useState<Array<Array<number | null>>>(DEFAULT_A)

  const matrix: Matrix = values.map((row) => row.map((v) => v ?? 0))

  const { det, inv } = useMemo(() => ({ det: det2(matrix), inv: inverse2(matrix) }), [matrix])

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite A:</p>
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
          <p>det(A) = {det}</p>
        </div>
        {inv ? (
          <>
            <span className="exercise-operator">→</span>
            <div className="matrix-display">
              <span className="matrix-display-label">A⁻¹ =</span>
              <MatrixGrid values={inv} readOnly />
            </div>
          </>
        ) : (
          <p className="matrix-lab-note">det(A) = 0 — essa matriz não tem inversa.</p>
        )}
      </div>
      <p className="matrix-lab-hint">Deixe det(A) chegar em zero (ex.: torne a segunda linha um múltiplo da primeira) e veja a inversa desaparecer.</p>
    </div>
  )
}

export default InverseLab
