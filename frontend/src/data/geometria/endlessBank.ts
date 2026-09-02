import type { Difficulty, Exercise } from '../exerciseTypes'
import { GEOMETRIA_EXERCISE_SETS } from './exerciseSets'

// Fold-only pool, same approach as the other modules' endlessBank.ts — no
// separate bonus-only question arrays, just the lesson/desafio exercises
// already written, grouped by difficulty.
function poolByDifficulty(): Record<Difficulty, Exercise[]> {
  const pool: Record<Difficulty, Exercise[]> = { easy: [], medium: [], hard: [] }
  for (const set of GEOMETRIA_EXERCISE_SETS) {
    pool[set.difficulty].push(...set.exercises)
  }
  return pool
}

export const GEOMETRIA_ENDLESS_BANK: Record<Difficulty, Exercise[]> = poolByDifficulty()

export const GEOMETRIA_ENDLESS_BANK_SIZE = Object.values(GEOMETRIA_ENDLESS_BANK).reduce(
  (sum, list) => sum + list.length,
  0,
)
