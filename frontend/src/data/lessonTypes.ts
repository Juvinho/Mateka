import type { Matrix } from '../lib/matrixMath'
import type { LessonTag } from '../components/modules/LessonCard'

export type LessonExample = { label: string; matrix: Matrix }

export type InteractiveWidget =
  | 'matrix-explorer'
  | 'operations-lab'
  | 'multiplication-lab'
  | 'determinant-lab'
  | 'inverse-lab'
  | 'transform-lab'
  | 'cayley-hamilton-verifier'

export type LessonContent = {
  id: string
  title: string
  description: string
  tags: LessonTag[]
  duration: number
  intro: string[]
  examples?: LessonExample[]
  after?: string[]
  interactiveWidget?: InteractiveWidget
  exerciseSetId: string
}

export type UnitContent = {
  number: number
  title: string
  lessons: LessonContent[]
}
