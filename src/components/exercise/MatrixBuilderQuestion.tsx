import { useState } from 'react'
import type { MatrixBuilderExercise } from '../../data/exerciseTypes'
import { colCount, rowCount } from '../../lib/matrixMath'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: MatrixBuilderExercise
  onSubmit: (answer: { kind: 'matrix-builder'; matrix: number[][] }) => void
  disabled?: boolean
}

const MatrixBuilderQuestion = ({ exercise, onSubmit, disabled }: Props) => {
  const resultRows = rowCount(exercise.operandA)
  const resultCols = colCount(exercise.operandB)
  const [values, setValues] = useState<Array<Array<number | null>>>(() =>
    Array.from({ length: resultRows }, () => Array.from({ length: resultCols }, () => null)),
  )
  const [focusedCell, setFocusedCell] = useState<{ r: number; c: number } | null>(null)

  const isComplete = values.every((row) => row.every((v) => v !== null))

  return (
    <div>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="exercise-builder-row">
        <div className="matrix-display">
          <span className="matrix-display-label">{exercise.operandALabel ?? 'A'} =</span>
          <MatrixGrid values={exercise.operandA} readOnly highlightRow={focusedCell?.r ?? null} />
        </div>
        <span className="exercise-operator">{exercise.operatorLabel}</span>
        <div className="matrix-display">
          <span className="matrix-display-label">{exercise.operandBLabel ?? 'B'} =</span>
          <MatrixGrid values={exercise.operandB} readOnly highlightCol={focusedCell?.c ?? null} />
        </div>
        <span className="exercise-operator">=</span>
        <MatrixGrid
          values={values}
          editableMask={values.map((row) => row.map(() => true))}
          disabled={disabled}
          onFocusCell={(r, c) => setFocusedCell({ r, c })}
          onChange={(r, c, v) => {
            setValues((prev) => {
              const next = prev.map((row) => row.slice())
              next[r][c] = v
              return next
            })
          }}
        />
      </div>
      <p className="exercise-hint">Toque em uma célula do resultado para destacar a linha e a coluna usadas.</p>
      <button
        type="button"
        className="btn-primary"
        disabled={!isComplete || disabled}
        onClick={() => onSubmit({ kind: 'matrix-builder', matrix: values as number[][] })}
      >
        Verificar
      </button>
    </div>
  )
}

export default MatrixBuilderQuestion
