import type { Exercise } from '../../data/exerciseTypes'
import type { ExerciseAnswer } from '../../lib/grading'
import MatrixBuilderQuestion from './MatrixBuilderQuestion'
import MatrixFillQuestion from './MatrixFillQuestion'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import TrueFalseQuestion from './TrueFalseQuestion'

type Props = {
  exercise: Exercise
  onAnswer: (answer: ExerciseAnswer) => void
  disabled?: boolean
  requireDimensionPick?: boolean
}

const ExerciseRenderer = ({ exercise, onAnswer, disabled, requireDimensionPick }: Props) => {
  switch (exercise.kind) {
    case 'multiple-choice':
      return <MultipleChoiceQuestion exercise={exercise} onSubmit={onAnswer} disabled={disabled} />
    case 'true-false':
      return <TrueFalseQuestion exercise={exercise} onSubmit={onAnswer} disabled={disabled} />
    case 'matrix-fill':
      return <MatrixFillQuestion exercise={exercise} onSubmit={onAnswer} disabled={disabled} />
    case 'matrix-builder':
      return (
        <MatrixBuilderQuestion
          exercise={exercise}
          onSubmit={onAnswer}
          disabled={disabled}
          requireDimensionPick={requireDimensionPick}
        />
      )
  }
}

export default ExerciseRenderer
