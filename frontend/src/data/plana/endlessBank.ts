import type { Difficulty, Exercise } from '../exerciseTypes'
import { PLANA_EXERCISE_SETS } from './exerciseSets'

// Fold-only pool, same approach as the other modules' endlessBank.ts.
function poolByDifficulty(): Record<Difficulty, Exercise[]> {
  const pool: Record<Difficulty, Exercise[]> = { easy: [], medium: [], hard: [] }
  for (const set of PLANA_EXERCISE_SETS) {
    pool[set.difficulty].push(...set.exercises)
  }
  return pool
}

export const PLANA_ENDLESS_BANK: Record<Difficulty, Exercise[]> = poolByDifficulty()

export const PLANA_ENDLESS_BANK_SIZE = Object.values(PLANA_ENDLESS_BANK).reduce(
  (sum, list) => sum + list.length,
  0,
)
