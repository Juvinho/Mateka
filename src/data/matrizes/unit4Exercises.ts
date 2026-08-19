import { det2, det3, transpose } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const A2 = [[3, 8], [4, 6]]
const M = [[1, 2, 3], [4, 5, 6]]
const A3 = [[6, 1, 1], [4, -2, 5], [2, 8, 7]]

const determinanteExercises: Exercise[] = [
  {
    id: 'u4-e1',
    kind: 'multiple-choice',
    prompt: 'Qual é o determinante da matriz A?',
    context: [{ label: 'A', matrix: A2 }],
    choices: [
      { id: 'a', label: String(det2(A2)) },
      { id: 'b', label: '14' },
      { id: 'c', label: '50' },
      { id: 'd', label: '-2' },
    ],
    correctChoiceId: 'a',
    explanation: 'det(A) = a·d − b·c = 3×6 − 8×4 = 18 − 32 = -14.',
  },
  {
    id: 'u4-e2',
    kind: 'matrix-fill',
    prompt: 'Complete a transposta de M (Mᵀ troca linhas por colunas).',
    context: [{ label: 'M', matrix: M }],
    template: [
      [1, 4],
      [2, null],
      [3, 6],
    ],
    solution: transpose(M),
    explanation: 'A linha 2 de M vira a coluna 2 de Mᵀ: [2, 5] → posições (1,2) e (2,2).',
  },
  {
    id: 'u4-e3',
    kind: 'true-false',
    prompt: 'Transpor uma matriz duas vezes devolve a matriz original — essa igualdade está correta?',
    operandA: M,
    operandALabel: '(Mᵀ)ᵀ',
    claimedResult: transpose(transpose(M)),
    isCorrect: true,
    explanation: 'Transpor duas vezes sempre devolve a matriz original: (Mᵀ)ᵀ = M.',
  },
  {
    id: 'u4-e4',
    kind: 'multiple-choice',
    prompt: 'Qual é o determinante de uma matriz identidade, de qualquer tamanho?',
    choices: [
      { id: 'a', label: '1' },
      { id: 'b', label: '0' },
      { id: 'c', label: 'depende do tamanho' },
      { id: 'd', label: 'não tem determinante' },
    ],
    correctChoiceId: 'a',
    explanation: 'O determinante da matriz identidade é sempre 1, não importa a dimensão.',
  },
  {
    id: 'u4-e5',
    kind: 'multiple-choice',
    prompt: 'Qual é o determinante da matriz A (3×3) abaixo?',
    context: [{ label: 'A', matrix: A3 }],
    choices: [
      { id: 'a', label: String(det3(A3)) },
      { id: 'b', label: '306' },
      { id: 'c', label: '-288' },
      { id: 'd', label: '0' },
    ],
    correctChoiceId: 'a',
    explanation: 'Usando a regra de Sarrus (ou expansão por cofatores) em A, o determinante é -306.',
  },
]

export const unit4ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-determinante',
    unitNumber: 4,
    icon: 'det',
    difficulty: 'medium',
    title: 'Determinante e Transposta',
    description: 'Calcule determinantes 2×2 e 3×3, e pratique a transposta.',
    points: 70,
    exercises: determinanteExercises,
  },
]
