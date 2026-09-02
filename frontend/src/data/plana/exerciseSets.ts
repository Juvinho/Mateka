import type { ExerciseSet } from '../exerciseTypes'
import { PLANA_UNIT1_EXERCISE_SETS } from './unit1Exercises'
import { PLANA_UNIT2_EXERCISE_SETS } from './unit2Exercises'
import { PLANA_UNIT3_EXERCISE_SETS } from './unit3Exercises'
import { PLANA_UNIT4_EXERCISE_SETS } from './unit4Exercises'
import { PLANA_UNIT5_EXERCISE_SETS } from './unit5Exercises'
import { PLANA_UNIT6_EXERCISE_SETS } from './unit6Exercises'
import { PLANA_UNIT7_EXERCISE_SETS } from './unit7Exercises'
import { PLANA_UNIT8_EXERCISE_SETS } from './unit8Exercises'
import { PLANA_UNIT9_EXERCISE_SETS } from './unit9Exercises'

export const PLANA_EXERCISE_SETS: ExerciseSet[] = [
  ...PLANA_UNIT1_EXERCISE_SETS,
  ...PLANA_UNIT2_EXERCISE_SETS,
  ...PLANA_UNIT3_EXERCISE_SETS,
  ...PLANA_UNIT4_EXERCISE_SETS,
  ...PLANA_UNIT5_EXERCISE_SETS,
  ...PLANA_UNIT6_EXERCISE_SETS,
  ...PLANA_UNIT7_EXERCISE_SETS,
  ...PLANA_UNIT8_EXERCISE_SETS,
  ...PLANA_UNIT9_EXERCISE_SETS,
]

export const PLANA_EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  PLANA_EXERCISE_SETS.map((set) => [set.id, set]),
)
