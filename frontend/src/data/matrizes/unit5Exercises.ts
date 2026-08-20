import { det2, identity, inverse2, multiply } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const A = [[3, 2], [1, 1]]
const Ainv = inverse2(A) as number[][]

const inversaExercises: Exercise[] = [
  {
    id: 'u5-e1',
    kind: 'multiple-choice',
    prompt: 'Qual é o determinante de A?',
    context: [{ label: 'A', matrix: A }],
    choices: [
      { id: 'a', label: String(det2(A)) },
      { id: 'b', label: '-1' },
      { id: 'c', label: '5' },
      { id: 'd', label: '2' },
    ],
    correctChoiceId: 'a',
    explanation: 'det(A) = 3×1 − 2×1 = 1.',
  },
  {
    id: 'u5-e2',
    kind: 'matrix-fill',
    prompt: 'Complete a inversa de A (A⁻¹).',
    context: [{ label: 'A', matrix: A }],
    template: [
      [1, null],
      [-1, 3],
    ],
    solution: Ainv,
    explanation: 'A⁻¹ = (1/det) × [d -b; -c a] = [1 -2; -1 3], já que det(A) = 1.',
  },
  {
    id: 'u5-e3',
    kind: 'true-false',
    prompt: 'Essa igualdade está correta? (A × A⁻¹ deveria dar a matriz identidade)',
    operandA: A,
    operandALabel: 'A',
    operatorLabel: '×',
    operandB: Ainv,
    operandBLabel: 'A⁻¹',
    claimedResult: identity(2),
    isCorrect: multiply(A, Ainv).every((row, i) => row.every((v, j) => Math.abs(v - identity(2)[i][j]) < 1e-9)),
    explanation: 'Por definição, uma matriz multiplicada pela sua inversa sempre resulta na matriz identidade.',
  },
  {
    id: 'u5-e4',
    kind: 'multiple-choice',
    prompt: 'Uma matriz quadrada só tem inversa quando...',
    choices: [
      { id: 'a', label: 'seu determinante é diferente de zero' },
      { id: 'b', label: 'todos os elementos são positivos' },
      { id: 'c', label: 'ela já é a matriz identidade' },
      { id: 'd', label: 'seu determinante é exatamente zero' },
    ],
    correctChoiceId: 'a',
    explanation: 'Se o determinante for zero, a matriz é "singular" e não tem inversa.',
  },
  {
    id: 'u5-e5',
    kind: 'multiple-choice',
    prompt: 'Se A × x = b, como encontramos x usando a matriz inversa?',
    choices: [
      { id: 'a', label: 'x = A⁻¹ × b' },
      { id: 'b', label: 'x = b × A' },
      { id: 'c', label: 'x = A × b⁻¹' },
      { id: 'd', label: 'x = b⁻¹ × A⁻¹' },
    ],
    correctChoiceId: 'a',
    explanation: 'Multiplicamos os dois lados por A⁻¹ à esquerda: A⁻¹ × A × x = A⁻¹ × b, e como A⁻¹×A = I, sobra x = A⁻¹ × b.',
  },
]

export const unit5ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-inversa',
    unitNumber: 5,
    icon: 'A⁻¹',
    difficulty: 'hard',
    title: 'Inversa e Sistemas Lineares',
    description: 'Calcule a inversa e use-a para resolver sistemas.',
    points: 90,
    exercises: inversaExercises,
  },
]
