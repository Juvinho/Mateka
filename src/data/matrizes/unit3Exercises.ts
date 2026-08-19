import { identity, multiply } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const A = [[1, 2], [3, 4]]
const B = [[5, 6], [7, 8]]
const I2 = identity(2)

const multiplicacaoExercises: Exercise[] = [
  {
    id: 'u3-e1',
    kind: 'matrix-builder',
    prompt: 'Construa o resultado de A × B, célula por célula.',
    operandA: A,
    operandALabel: 'A',
    operatorLabel: '×',
    operandB: B,
    operandBLabel: 'B',
    solution: multiply(A, B),
    explanation: 'Cada célula é a linha de A multiplicada pela coluna de B, somando os produtos: (1×5)+(2×7) = 19.',
  },
  {
    id: 'u3-e2',
    kind: 'multiple-choice',
    prompt: 'Uma matriz A é 2×3. Para multiplicá-la por uma matriz B (A × B), quantas linhas B precisa ter?',
    choices: [
      { id: 'a', label: '2' },
      { id: 'b', label: '3' },
      { id: 'c', label: '6' },
      { id: 'd', label: '1' },
    ],
    correctChoiceId: 'b',
    explanation: 'O número de colunas de A precisa ser igual ao número de linhas de B — nesse caso, 3.',
  },
  {
    id: 'u3-e3',
    kind: 'true-false',
    prompt: 'Essa multiplicação de matrizes está correta?',
    operandA: [[2, 3]],
    operandALabel: 'A',
    operatorLabel: '×',
    operandB: [[4], [5]],
    operandBLabel: 'B',
    claimedResult: multiply([[2, 3]], [[4], [5]]),
    isCorrect: true,
    explanation: '(2×4) + (3×5) = 8 + 15 = 23.',
  },
  {
    id: 'u3-e4',
    kind: 'true-false',
    prompt: 'Essa multiplicação de matrizes está correta?',
    operandA: I2,
    operandALabel: 'I',
    operatorLabel: '×',
    operandB: B,
    operandBLabel: 'B',
    claimedResult: [[5, 6], [7, 9]],
    isCorrect: false,
    explanation: 'Multiplicar pela identidade não muda a matriz: I × B deveria ser igual a B = [5 6; 7 8], não [5 6; 7 9].',
  },
  {
    id: 'u3-e5',
    kind: 'multiple-choice',
    prompt: 'Multiplicar uma matriz pela matriz identidade resulta em...',
    choices: [
      { id: 'a', label: 'a própria matriz, sem mudanças' },
      { id: 'b', label: 'a matriz nula' },
      { id: 'c', label: 'a matriz transposta' },
      { id: 'd', label: 'o dobro da matriz' },
    ],
    correctChoiceId: 'a',
    explanation: 'A identidade funciona como o número 1 na multiplicação de matrizes.',
  },
]

export const unit3ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-multiplicacao',
    unitNumber: 3,
    icon: '×',
    difficulty: 'medium',
    title: 'Multiplicação de Matrizes',
    description: 'Pratique linha por coluna e as regras de compatibilidade.',
    points: 70,
    exercises: multiplicacaoExercises,
  },
]
