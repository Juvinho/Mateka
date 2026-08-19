import { useMemo, useState } from 'react'
import MatrixGrid from './exercise/MatrixGrid'
import { det2, identity, multiply, scalarMul, sub, sum, trace, type Matrix } from '../lib/matrixMath'

const DEFAULT_A: Matrix = [[1, 2], [3, 4]]

const CayleyHamiltonVerifier = () => {
  const [values, setValues] = useState<Array<Array<number | null>>>(DEFAULT_A)

  const matrix: Matrix = values.map((row) => row.map((v) => v ?? 0))

  const { tr, det, aSquared, pOfA } = useMemo(() => {
    const trVal = trace(matrix)
    const detVal = det2(matrix)
    const aSq = multiply(matrix, matrix)
    const result = sum(sub(aSq, scalarMul(trVal, matrix)), scalarMul(detVal, identity(2)))
    return { tr: trVal, det: detVal, aSquared: aSq, pOfA: result }
  }, [values])

  return (
    <div className="ch-verifier">
      <p className="ch-verifier-label">Edite A e observe:</p>
      <div className="ch-verifier-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A =</span>
          <MatrixGrid
            values={values}
            editableMask={values.map((row) => row.map(() => true))}
            onChange={(r, c, v) => {
              setValues((prev) => {
                const next = prev.map((row) => row.slice())
                next[r][c] = v
                return next
              })
            }}
          />
        </div>
        <div className="ch-verifier-formula">
          <p>tr(A) = {tr}</p>
          <p>det(A) = {det}</p>
          <p>p(λ) = λ² − {tr}λ + ({det})</p>
        </div>
        <div className="matrix-display">
          <span className="matrix-display-label">A² =</span>
          <MatrixGrid values={aSquared} readOnly />
        </div>
        <span className="exercise-operator">→</span>
        <div className="matrix-display">
          <span className="matrix-display-label">p(A) =</span>
          <MatrixGrid values={pOfA} readOnly />
        </div>
      </div>
      <p className="ch-verifier-hint">p(A) = A² − tr(A)·A + det(A)·I sempre dá a matriz nula, para qualquer A que você digitar.</p>
    </div>
  )
}

export default CayleyHamiltonVerifier
