import type { ExerciseSet } from '../exerciseTypes'
import { SISTEMAS_UNIT1_EXERCISE_SETS } from './unit1Exercises'
import { SISTEMAS_UNIT2_EXERCISE_SETS } from './unit2Exercises'
import { SISTEMAS_UNIT3_EXERCISE_SETS } from './unit3Exercises'
import { SISTEMAS_UNIT4_EXERCISE_SETS } from './unit4Exercises'
import { SISTEMAS_UNIT5_EXERCISE_SETS } from './unit5Exercises'
import { SISTEMAS_UNIT6_EXERCISE_SETS } from './unit6Exercises'
import { SISTEMAS_UNIT7_EXERCISE_SETS } from './unit7Exercises'
import { SISTEMAS_UNIT8_EXERCISE_SETS } from './unit8Exercises'
import { SISTEMAS_UNIT9_EXERCISE_SETS } from './unit9Exercises'

export const SISTEMAS_EXERCISE_SETS: ExerciseSet[] = [
  ...SISTEMAS_UNIT1_EXERCISE_SETS,
  ...SISTEMAS_UNIT2_EXERCISE_SETS,
  ...SISTEMAS_UNIT3_EXERCISE_SETS,
  ...SISTEMAS_UNIT4_EXERCISE_SETS,
  ...SISTEMAS_UNIT5_EXERCISE_SETS,
  ...SISTEMAS_UNIT6_EXERCISE_SETS,
  ...SISTEMAS_UNIT7_EXERCISE_SETS,
  ...SISTEMAS_UNIT8_EXERCISE_SETS,
  ...SISTEMAS_UNIT9_EXERCISE_SETS,
]

export const SISTEMAS_EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  SISTEMAS_EXERCISE_SETS.map((set) => [set.id, set]),
)
