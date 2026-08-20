import { useState } from 'react'
import MatrixGrid from '../exercise/MatrixGrid'
import { colCount, rowCount, toSubscript, type Matrix } from '../../lib/matrixMath'

const DEFAULT_A: Matrix = [[2, 5, 9], [1, 4, 7], [3, 6, 8]]

const MatrixExplorerLab = () => {
  const [values, setValues] = useState<Array<Array<number | null>>>(DEFAULT_A)
  const [focused, setFocused] = useState<{ r: number; c: number } | null>(null)

  const matrix: Matrix = values.map((row) => row.map((v) => v ?? 0))
  const rows = rowCount(matrix)
  const cols = colCount(matrix)

  return (
    <div className="matrix-lab">
      <p className="matrix-lab-label">Edite A e clique numa célula:</p>
      <div className="matrix-lab-row">
        <div className="matrix-display">
          <span className="matrix-display-label">A =</span>
          <MatrixGrid
            values={values}
            editableMask={values.map((row) => row.map(() => true))}
            highlightRow={focused?.r ?? null}
            highlightCol={focused?.c ?? null}
            onFocusCell={(r, c) => setFocused({ r, c })}
            onChange={(r, c, v) => {
              setValues((prev) => {
                const next = prev.map((row) => row.slice())
                next[r][c] = v
                return next
              })
            }}
          />
        </div>
        <div className="matrix-lab-formula">
          <p>Dimensão: {rows}×{cols}</p>
          <p className="matrix-lab-selected">
            {focused
              ? `a${toSubscript(focused.r + 1)}${toSubscript(focused.c + 1)} = ${matrix[focused.r][focused.c]}`
              : 'Clique numa célula para ver sua posição'}
          </p>
        </div>
      </div>
      <p className="matrix-lab-hint">Cada elemento é identificado por aᵢⱼ — i é a linha, j é a coluna.</p>
    </div>
  )
}

export default MatrixExplorerLab
