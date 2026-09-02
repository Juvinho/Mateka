import type { ExerciseSet } from '../exerciseTypes'
import { ESPACIAL_UNIT1_EXERCISE_SETS } from './unit1Exercises'
import { ESPACIAL_UNIT2_EXERCISE_SETS } from './unit2Exercises'
import { ESPACIAL_UNIT3_EXERCISE_SETS } from './unit3Exercises'
import { ESPACIAL_UNIT4_EXERCISE_SETS } from './unit4Exercises'
import { ESPACIAL_UNIT5_EXERCISE_SETS } from './unit5Exercises'
import { ESPACIAL_UNIT6_EXERCISE_SETS } from './unit6Exercises'
import { ESPACIAL_UNIT7_EXERCISE_SETS } from './unit7Exercises'
import { ESPACIAL_UNIT8_EXERCISE_SETS } from './unit8Exercises'
import { ESPACIAL_UNIT9_EXERCISE_SETS } from './unit9Exercises'

export const ESPACIAL_EXERCISE_SETS: ExerciseSet[] = [
  ...ESPACIAL_UNIT1_EXERCISE_SETS,
  ...ESPACIAL_UNIT2_EXERCISE_SETS,
  ...ESPACIAL_UNIT3_EXERCISE_SETS,
  ...ESPACIAL_UNIT4_EXERCISE_SETS,
  ...ESPACIAL_UNIT5_EXERCISE_SETS,
  ...ESPACIAL_UNIT6_EXERCISE_SETS,
  ...ESPACIAL_UNIT7_EXERCISE_SETS,
  ...ESPACIAL_UNIT8_EXERCISE_SETS,
  ...ESPACIAL_UNIT9_EXERCISE_SETS,
]

export const ESPACIAL_EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  ESPACIAL_EXERCISE_SETS.map((set) => [set.id, set]),
)
