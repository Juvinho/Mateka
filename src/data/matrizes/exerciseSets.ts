import type { ExerciseSet } from '../exerciseTypes'
import { unit1ExerciseSets } from './unit1Exercises'
import { unit2ExerciseSets } from './unit2Exercises'
import { unit3ExerciseSets } from './unit3Exercises'
import { unit4ExerciseSets } from './unit4Exercises'
import { unit5ExerciseSets } from './unit5Exercises'
import { unit6ExerciseSets } from './unit6Exercises'

export const ALL_EXERCISE_SETS: ExerciseSet[] = [
  ...unit1ExerciseSets,
  ...unit2ExerciseSets,
  ...unit3ExerciseSets,
  ...unit4ExerciseSets,
  ...unit5ExerciseSets,
  ...unit6ExerciseSets,
]

export const EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  ALL_EXERCISE_SETS.map((set) => [set.id, set]),
)
