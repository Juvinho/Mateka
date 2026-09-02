import type { ExerciseSet } from '../exerciseTypes'
import { GEOMETRIA_UNIT1_EXERCISE_SETS } from './unit1Exercises'
import { GEOMETRIA_UNIT2_EXERCISE_SETS } from './unit2Exercises'
import { GEOMETRIA_UNIT3_EXERCISE_SETS } from './unit3Exercises'
import { GEOMETRIA_UNIT4_EXERCISE_SETS } from './unit4Exercises'
import { GEOMETRIA_UNIT5_EXERCISE_SETS } from './unit5Exercises'
import { GEOMETRIA_UNIT6_EXERCISE_SETS } from './unit6Exercises'
import { GEOMETRIA_UNIT7_EXERCISE_SETS } from './unit7Exercises'
import { GEOMETRIA_UNIT8_EXERCISE_SETS } from './unit8Exercises'
import { GEOMETRIA_UNIT9_EXERCISE_SETS } from './unit9Exercises'

export const GEOMETRIA_EXERCISE_SETS: ExerciseSet[] = [
  ...GEOMETRIA_UNIT1_EXERCISE_SETS,
  ...GEOMETRIA_UNIT2_EXERCISE_SETS,
  ...GEOMETRIA_UNIT3_EXERCISE_SETS,
  ...GEOMETRIA_UNIT4_EXERCISE_SETS,
  ...GEOMETRIA_UNIT5_EXERCISE_SETS,
  ...GEOMETRIA_UNIT6_EXERCISE_SETS,
  ...GEOMETRIA_UNIT7_EXERCISE_SETS,
  ...GEOMETRIA_UNIT8_EXERCISE_SETS,
  ...GEOMETRIA_UNIT9_EXERCISE_SETS,
]

export const GEOMETRIA_EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  GEOMETRIA_EXERCISE_SETS.map((set) => [set.id, set]),
)
