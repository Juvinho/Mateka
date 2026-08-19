import type { Exercise } from '../data/exerciseTypes'
import type { Matrix } from './matrixMath'
import { matricesEqual } from './matrixMath'

export type ExerciseAnswer =
  | { kind: 'multiple-choice'; choiceId: string }
  | { kind: 'true-false'; value: boolean }
  | { kind: 'matrix-fill'; matrix: Matrix }
  | { kind: 'matrix-builder'; matrix: Matrix }

export function gradeExercise(exercise: Exercise, answer: ExerciseAnswer): boolean {
  switch (exercise.kind) {
    case 'multiple-choice':
      return answer.kind === 'multiple-choice' && answer.choiceId === exercise.correctChoiceId
    case 'true-false':
      return answer.kind === 'true-false' && answer.value === exercise.isCorrect
    case 'matrix-fill':
      return answer.kind === 'matrix-fill' && matricesEqual(answer.matrix, exercise.solution)
    case 'matrix-builder':
      return answer.kind === 'matrix-builder' && matricesEqual(answer.matrix, exercise.solution)
  }
}
