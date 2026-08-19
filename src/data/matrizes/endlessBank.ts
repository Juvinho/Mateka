import { scalarMul } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'
import { ALL_EXERCISE_SETS } from './exerciseSets'

export type Difficulty = ExerciseSet['difficulty']

const bonusEasy: Exercise[] = [
  {
    id: 'endless-easy-1',
    kind: 'multiple-choice',
    prompt: 'Qual é a dimensão de uma matriz com 4 linhas e 6 colunas?',
    choices: [
      { id: 'a', label: '4×6' },
      { id: 'b', label: '6×4' },
      { id: 'c', label: '10' },
      { id: 'd', label: '24' },
    ],
    correctChoiceId: 'a',
    explanation: 'A convenção é sempre linhas × colunas: 4×6.',
  },
  {
    id: 'endless-easy-2',
    kind: 'multiple-choice',
    prompt: 'Quantos elementos tem uma matriz 5×2?',
    choices: [
      { id: 'a', label: '10' },
      { id: 'b', label: '7' },
      { id: 'c', label: '52' },
      { id: 'd', label: '25' },
    ],
    correctChoiceId: 'a',
    explanation: 'Multiplicamos linhas por colunas: 5 × 2 = 10.',
  },
]

const bonusMedium: Exercise[] = [
  {
    id: 'endless-medium-1',
    kind: 'true-false',
    prompt: 'Essa multiplicação por escalar está correta?',
    operandA: [[2, 4], [1, 3]],
    operandALabel: 'A',
    operatorLabel: '2 ·',
    claimedResult: scalarMul(2, [[2, 4], [1, 3]]),
    isCorrect: true,
    explanation: 'Multiplicar por 2 dobra cada elemento de A: 2A = [4 8; 2 6].',
  },
]

const bonusHard: Exercise[] = [
  {
    id: 'endless-hard-1',
    kind: 'multiple-choice',
    prompt: 'Se o determinante de uma matriz quadrada é zero, o que isso significa?',
    choices: [
      { id: 'a', label: 'a matriz não tem inversa' },
      { id: 'b', label: 'a matriz é a identidade' },
      { id: 'c', label: 'todos os elementos são zero' },
      { id: 'd', label: 'a matriz é simétrica' },
    ],
    correctChoiceId: 'a',
    explanation: 'Uma matriz com determinante zero é "singular" — não existe inversa para ela.',
  },
]

function poolByDifficulty(): Record<Difficulty, Exercise[]> {
  const pool: Record<Difficulty, Exercise[]> = { easy: [...bonusEasy], medium: [...bonusMedium], hard: [...bonusHard] }
  for (const set of ALL_EXERCISE_SETS) {
    pool[set.difficulty].push(...set.exercises)
  }
  return pool
}

export const ENDLESS_BANK: Record<Difficulty, Exercise[]> = poolByDifficulty()

export const ENDLESS_BANK_SIZE = Object.values(ENDLESS_BANK).reduce((sum, list) => sum + list.length, 0)

export function shuffle<T>(items: T[]): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
