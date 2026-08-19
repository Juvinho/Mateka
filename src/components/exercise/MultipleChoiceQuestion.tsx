import { useState } from 'react'
import type { MultipleChoiceExercise } from '../../data/exerciseTypes'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: MultipleChoiceExercise
  onSubmit: (answer: { kind: 'multiple-choice'; choiceId: string }) => void
  disabled?: boolean
}

const MultipleChoiceQuestion = ({ exercise, onSubmit, disabled }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="exercise-choices">
        {exercise.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={`exercise-choice-btn${selected === choice.id ? ' is-selected' : ''}`}
            onClick={() => setSelected(choice.id)}
            disabled={disabled}
          >
            {choice.matrix ? <MatrixGrid values={choice.matrix} readOnly /> : choice.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={!selected || disabled}
        onClick={() => selected && onSubmit({ kind: 'multiple-choice', choiceId: selected })}
      >
        Verificar
      </button>
    </div>
  )
}

export default MultipleChoiceQuestion
