import { useState } from 'react'
import type { MatrixFillExercise } from '../../data/exerciseTypes'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: MatrixFillExercise
  onSubmit: (answer: { kind: 'matrix-fill'; matrix: number[][] }) => void
  disabled?: boolean
}

const MatrixFillQuestion = ({ exercise, onSubmit, disabled }: Props) => {
  const [values, setValues] = useState<Array<Array<number | null>>>(() =>
    exercise.template.map((row) => row.slice()),
  )

  const isComplete = values.every((row) => row.every((v) => v !== null))

  return (
    <div>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <MatrixGrid
        values={values}
        editableMask={exercise.template.map((row) => row.map((v) => v === null))}
        disabled={disabled}
        onChange={(r, c, v) => {
          setValues((prev) => {
            const next = prev.map((row) => row.slice())
            next[r][c] = v
            return next
          })
        }}
      />
      <button
        type="button"
        className="btn-primary"
        disabled={!isComplete || disabled}
        onClick={() => onSubmit({ kind: 'matrix-fill', matrix: values as number[][] })}
      >
        Verificar
      </button>
    </div>
  )
}

export default MatrixFillQuestion
