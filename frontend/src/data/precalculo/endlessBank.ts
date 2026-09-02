import type { Difficulty, Exercise } from '../exerciseTypes'
import { PRECALCULO_EXERCISE_SETS } from './exerciseSets'

// Unlike Conceitos Básicos, this pool folds only the exercises already
// written for lessons/desafios by their own difficulty — no separate
// bonus-only question arrays. Still a real, working Endless pool (~45-55
// unique questions per difficulty before any repeat); bonus arrays can be
// added later the same way Conceitos Básicos's endlessBank.ts does it, if
// the pool ever needs to be deeper.
function poolByDifficulty(): Record<Difficulty, Exercise[]> {
  const pool: Record<Difficulty, Exercise[]> = { easy: [], medium: [], hard: [] }
  for (const set of PRECALCULO_EXERCISE_SETS) {
    pool[set.difficulty].push(...set.exercises)
  }
  return pool
}

export const PRECALCULO_ENDLESS_BANK: Record<Difficulty, Exercise[]> = poolByDifficulty()

export const PRECALCULO_ENDLESS_BANK_SIZE = Object.values(PRECALCULO_ENDLESS_BANK).reduce(
  (sum, list) => sum + list.length,
  0,
)
