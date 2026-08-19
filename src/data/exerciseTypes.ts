import type { Matrix } from '../lib/matrixMath'

export type { Matrix }

export type ContextItem = {
  label: string
  matrix: Matrix
}

export type Choice = {
  id: string
  label?: string
  matrix?: Matrix
}

type ExerciseBase = {
  id: string
  prompt: string
  explanation?: string
  context?: ContextItem[]
}

export type MultipleChoiceExercise = ExerciseBase & {
  kind: 'multiple-choice'
  choices: Choice[]
  correctChoiceId: string
}

export type TrueFalseExercise = ExerciseBase & {
  kind: 'true-false'
  operandA?: Matrix
  operandALabel?: string
  operatorLabel?: string
  operandB?: Matrix
  operandBLabel?: string
  claimedResult: Matrix
  isCorrect: boolean
}

export type MatrixFillExercise = ExerciseBase & {
  kind: 'matrix-fill'
  template: Array<Array<number | null>>
  solution: Matrix
}

export type MatrixBuilderExercise = ExerciseBase & {
  kind: 'matrix-builder'
  operandA: Matrix
  operandALabel?: string
  operatorLabel: string
  operandB: Matrix
  operandBLabel?: string
  solution: Matrix
}

export type Exercise = MultipleChoiceExercise | TrueFalseExercise | MatrixFillExercise | MatrixBuilderExercise

export type ExerciseSet = {
  id: string
  unitNumber: number
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  description: string
  points: number
  exercises: Exercise[]
}
