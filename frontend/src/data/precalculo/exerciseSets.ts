import type { ExerciseSet } from '../exerciseTypes'
import { PRECALCULO_UNIT1_EXERCISE_SETS } from './unit1Exercises'
import { PRECALCULO_UNIT2_EXERCISE_SETS } from './unit2Exercises'
import { PRECALCULO_UNIT3_EXERCISE_SETS } from './unit3Exercises'
import { PRECALCULO_UNIT4_EXERCISE_SETS } from './unit4Exercises'
import { PRECALCULO_UNIT5_EXERCISE_SETS } from './unit5Exercises'
import { PRECALCULO_UNIT6_EXERCISE_SETS } from './unit6Exercises'
import { PRECALCULO_UNIT7_EXERCISE_SETS } from './unit7Exercises'
import { PRECALCULO_UNIT8_EXERCISE_SETS } from './unit8Exercises'
import { PRECALCULO_UNIT9_EXERCISE_SETS } from './unit9Exercises'

export const PRECALCULO_EXERCISE_SETS: ExerciseSet[] = [
  ...PRECALCULO_UNIT1_EXERCISE_SETS,
  ...PRECALCULO_UNIT2_EXERCISE_SETS,
  ...PRECALCULO_UNIT3_EXERCISE_SETS,
  ...PRECALCULO_UNIT4_EXERCISE_SETS,
  ...PRECALCULO_UNIT5_EXERCISE_SETS,
  ...PRECALCULO_UNIT6_EXERCISE_SETS,
  ...PRECALCULO_UNIT7_EXERCISE_SETS,
  ...PRECALCULO_UNIT8_EXERCISE_SETS,
  ...PRECALCULO_UNIT9_EXERCISE_SETS,
]

export const PRECALCULO_EXERCISE_SET_BY_ID: Record<string, ExerciseSet> = Object.fromEntries(
  PRECALCULO_EXERCISE_SETS.map((set) => [set.id, set]),
)
