import type { TrueFalseExercise } from '../../data/exerciseTypes'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: TrueFalseExercise
  onSubmit: (answer: { kind: 'true-false'; value: boolean }) => void
  disabled?: boolean
}

const TrueFalseQuestion = ({ exercise, onSubmit, disabled }: Props) => {
  return (
    <div>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="exercise-claim-row">
        {exercise.operandA && (
          <div className="matrix-display">
            <span className="matrix-display-label">{exercise.operandALabel ?? 'A'} =</span>
            <MatrixGrid values={exercise.operandA} readOnly />
          </div>
        )}
        {exercise.operatorLabel && <span className="exercise-operator">{exercise.operatorLabel}</span>}
        {exercise.operandB && (
          <div className="matrix-display">
            <span className="matrix-display-label">{exercise.operandBLabel ?? 'B'} =</span>
            <MatrixGrid values={exercise.operandB} readOnly />
          </div>
        )}
        <span className="exercise-operator">=</span>
        <MatrixGrid values={exercise.claimedResult} readOnly />
      </div>
      <div className="exercise-tf-buttons">
        <button type="button" className="btn-primary" disabled={disabled} onClick={() => onSubmit({ kind: 'true-false', value: true })}>
          Verdadeiro
        </button>
        <button type="button" className="btn-secondary" disabled={disabled} onClick={() => onSubmit({ kind: 'true-false', value: false })}>
          Falso
        </button>
      </div>
    </div>
  )
}

export default TrueFalseQuestion
