import { sub, sum, scalarMul } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const A = [[1, 2], [3, 4]]
const B = [[5, 6], [7, 8]]
const C = [[2, 0], [1, 3]]

const operacoesExercises: Exercise[] = [
  {
    id: 'u2-e1',
    kind: 'matrix-fill',
    prompt: 'Complete a soma A + B.',
    context: [
      { label: 'A', matrix: A },
      { label: 'B', matrix: B },
    ],
    template: [
      [6, null],
      [10, 12],
    ],
    solution: sum(A, B),
    explanation: 'Somamos os elementos que estão na mesma posição: 2 + 6 = 8.',
  },
  {
    id: 'u2-e2',
    kind: 'multiple-choice',
    prompt: 'Qual dessas matrizes é o resultado correto de A − B?',
    context: [
      { label: 'A', matrix: A },
      { label: 'B', matrix: B },
    ],
    choices: [
      { id: 'a', matrix: sub(A, B) },
      { id: 'b', matrix: sub(B, A) },
      { id: 'c', matrix: sum(A, B) },
      { id: 'd', matrix: [[-4, 4], [4, -4]] },
    ],
    correctChoiceId: 'a',
    explanation: 'Subtraímos elemento a elemento: A − B = [-4 -4; -4 -4].',
  },
  {
    id: 'u2-e3',
    kind: 'true-false',
    prompt: 'Essa multiplicação por escalar está correta?',
    operandA: C,
    operandALabel: 'C',
    operatorLabel: '3 ·',
    claimedResult: scalarMul(3, C),
    isCorrect: true,
    explanation: 'Multiplicar por um escalar significa multiplicar TODOS os elementos por esse número: 3 × C = [6 0; 3 9].',
  },
  {
    id: 'u2-e4',
    kind: 'true-false',
    prompt: 'Essa soma de matrizes está correta?',
    operandA: A,
    operandALabel: 'A',
    operatorLabel: '+',
    operandB: B,
    operandBLabel: 'B',
    claimedResult: [[6, 8], [10, 13]],
    isCorrect: false,
    explanation: 'O elemento da linha 2, coluna 2 deveria ser 4 + 8 = 12, não 13.',
  },
  {
    id: 'u2-e5',
    kind: 'matrix-fill',
    prompt: 'Preencha o resultado de A − C.',
    context: [
      { label: 'A', matrix: A },
      { label: 'C', matrix: C },
    ],
    template: [
      [null, null],
      [null, null],
    ],
    solution: sub(A, C),
    explanation: 'A − C: subtraia cada elemento de C do elemento correspondente de A.',
  },
]

export const unit2ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-operacoes',
    unitNumber: 2,
    icon: '+',
    difficulty: 'easy',
    title: 'Soma, Subtração e Escalar',
    description: 'Combine matrizes de mesma dimensão e multiplique por um número.',
    points: 50,
    exercises: operacoesExercises,
  },
]
