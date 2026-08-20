import { identity, inverse2, matricesEqual, multiply, scalarMul, sum, transpose } from '../../lib/matrixMath'
import type { Exercise, Difficulty } from '../exerciseTypes'
import { shuffle } from '../../lib/shuffle'
import { ALL_EXERCISE_SETS } from './exerciseSets'

export type { Difficulty }
export { shuffle }

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
  {
    id: 'endless-easy-3',
    kind: 'multiple-choice',
    prompt: 'Quantos elementos tem uma matriz 7×3?',
    choices: [
      { id: 'a', label: '21' },
      { id: 'b', label: '10' },
      { id: 'c', label: '73' },
      { id: 'd', label: '37' },
    ],
    correctChoiceId: 'a',
    explanation: 'Multiplicamos linhas por colunas: 7 × 3 = 21.',
  },
  {
    id: 'endless-easy-4',
    kind: 'true-false',
    prompt: 'Essa igualdade de matrizes está correta?',
    operandA: [[3, 1], [2, 5]],
    operandALabel: 'A',
    claimedResult: [[3, 1], [2, 5]],
    isCorrect: true,
    explanation: 'As duas matrizes têm a mesma dimensão e os mesmos elementos em cada posição, então são iguais.',
  },
  {
    id: 'endless-easy-5',
    kind: 'multiple-choice',
    prompt: 'Como se chama essa matriz, que tem apenas uma linha?',
    context: [{ label: 'L', matrix: [[4, 8, 1, 6]] }],
    choices: [
      { id: 'a', label: 'matriz linha' },
      { id: 'b', label: 'matriz coluna' },
      { id: 'c', label: 'matriz quadrada' },
      { id: 'd', label: 'matriz nula' },
    ],
    correctChoiceId: 'a',
    explanation: 'Com 1 linha e várias colunas (1×4), essa é uma matriz linha.',
  },
  {
    id: 'endless-easy-6',
    kind: 'matrix-fill',
    prompt: 'Complete a soma A + B.',
    context: [
      { label: 'A', matrix: [[1, 3], [2, 0]] },
      { label: 'B', matrix: [[4, 2], [1, 5]] },
    ],
    template: [
      [5, null],
      [null, 5],
    ],
    solution: sum([[1, 3], [2, 0]], [[4, 2], [1, 5]]),
    explanation: 'Somamos os elementos que estão na mesma posição: 3 + 2 = 5 e 2 + 1 = 3.',
  },
  {
    id: 'endless-easy-7',
    kind: 'true-false',
    prompt: 'Essa multiplicação por escalar está correta?',
    operandA: [[3, 2], [5, 4]],
    operandALabel: 'A',
    operatorLabel: '2 ·',
    claimedResult: [[6, 4], [10, 9]],
    isCorrect: false,
    explanation: 'O elemento da linha 2, coluna 2 deveria ser 2 × 4 = 8, não 9.',
  },
  {
    id: 'endless-easy-8',
    kind: 'multiple-choice',
    prompt: 'Uma matriz nula 4×1 tem quantos elementos e qual é o valor de cada um?',
    choices: [
      { id: 'a', label: '4 elementos, todos zero' },
      { id: 'b', label: '4 elementos, todos um' },
      { id: 'c', label: '1 elemento, igual a zero' },
      { id: 'd', label: '4 elementos, valores variados' },
    ],
    correctChoiceId: 'a',
    explanation: 'Matriz nula: todos os elementos valem 0, e 4×1 = 4 elementos ao todo.',
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
  {
    id: 'endless-medium-2',
    kind: 'matrix-fill',
    prompt: 'Complete a soma A + B.',
    context: [
      { label: 'A', matrix: [[2, 5], [6, 1]] },
      { label: 'B', matrix: [[3, 4], [2, 7]] },
    ],
    template: [
      [5, null],
      [8, 8],
    ],
    solution: sum([[2, 5], [6, 1]], [[3, 4], [2, 7]]),
    explanation: 'Somamos os elementos que estão na mesma posição: 5 + 4 = 9.',
  },
  {
    id: 'endless-medium-3',
    kind: 'multiple-choice',
    prompt: 'Uma matriz P é 4×2. Para multiplicá-la por uma matriz Q (P × Q), quantas linhas Q precisa ter?',
    choices: [
      { id: 'a', label: '2' },
      { id: 'b', label: '4' },
      { id: 'c', label: '8' },
      { id: 'd', label: '1' },
    ],
    correctChoiceId: 'a',
    explanation: 'O número de colunas de P precisa ser igual ao número de linhas de Q — nesse caso, 2.',
  },
  {
    id: 'endless-medium-4',
    kind: 'true-false',
    prompt: 'Essa subtração de matrizes está correta?',
    operandA: [[7, 3], [9, 2]],
    operandALabel: 'A',
    operatorLabel: '−',
    operandB: [[1, 5], [4, 2]],
    operandBLabel: 'B',
    claimedResult: [[6, -2], [5, 1]],
    isCorrect: false,
    explanation: 'O elemento da linha 2, coluna 2 deveria ser 2 − 2 = 0, não 1.',
  },
  {
    id: 'endless-medium-5',
    kind: 'multiple-choice',
    prompt: 'Qual é a dimensão da transposta de M?',
    context: [{ label: 'M', matrix: [[2, 9], [4, 1], [7, 3]] }],
    choices: [
      { id: 'a', label: '2×3' },
      { id: 'b', label: '3×2' },
      { id: 'c', label: '6×1' },
      { id: 'd', label: '2×2' },
    ],
    correctChoiceId: 'a',
    explanation: 'Transpor troca linhas por colunas: M é 3×2, então Mᵀ é 2×3.',
  },
  {
    id: 'endless-medium-6',
    kind: 'matrix-fill',
    prompt: 'Complete a transposta de N (Nᵀ troca linhas por colunas).',
    context: [{ label: 'N', matrix: [[5, 1, 8], [3, 6, 2]] }],
    template: [
      [5, 3],
      [1, null],
      [8, 2],
    ],
    solution: transpose([[5, 1, 8], [3, 6, 2]]),
    explanation: 'A coluna 2 de N, [1, 6], vira a linha 2 de Nᵀ.',
  },
  {
    id: 'endless-medium-7',
    kind: 'multiple-choice',
    prompt: 'Como calculamos o determinante de uma matriz 2×2 [[a, b], [c, d]]?',
    choices: [
      { id: 'a', label: 'ad − bc' },
      { id: 'b', label: 'ab − cd' },
      { id: 'c', label: 'ad + bc' },
      { id: 'd', label: 'a + d − b − c' },
    ],
    correctChoiceId: 'a',
    explanation: 'O determinante 2×2 é o produto da diagonal principal menos o produto da diagonal secundária: ad − bc.',
  },
]

const hardInverseA = [[2, 3], [1, 2]]
const hardInverseAinv = inverse2(hardInverseA)!

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
  {
    id: 'endless-hard-2',
    kind: 'matrix-fill',
    prompt: 'Complete a inversa de A (A⁻¹).',
    context: [{ label: 'A', matrix: hardInverseA }],
    template: [
      [2, -3],
      [-1, null],
    ],
    solution: hardInverseAinv,
    explanation: 'A⁻¹ = (1/det) × [d -b; -c a] = [2 -3; -1 2], já que det(A) = 1.',
  },
  {
    id: 'endless-hard-3',
    kind: 'true-false',
    prompt: 'Essa igualdade está correta? (A × A⁻¹ deveria dar a matriz identidade)',
    operandA: hardInverseA,
    operandALabel: 'A',
    operatorLabel: '×',
    operandB: hardInverseAinv,
    operandBLabel: 'A⁻¹',
    claimedResult: identity(2),
    isCorrect: matricesEqual(multiply(hardInverseA, hardInverseAinv), identity(2)),
    explanation: 'Por definição, uma matriz multiplicada pela sua inversa sempre resulta na matriz identidade.',
  },
  {
    id: 'endless-hard-4',
    kind: 'multiple-choice',
    prompt: 'Se o determinante de uma matriz 3×3 é negativo, isso significa que:',
    choices: [
      { id: 'a', label: 'a matriz ainda pode ter inversa, contanto que o determinante não seja zero' },
      { id: 'b', label: 'a matriz não pode ter inversa' },
      { id: 'c', label: 'a matriz é singular' },
      { id: 'd', label: 'todos os elementos de A são negativos' },
    ],
    correctChoiceId: 'a',
    explanation: 'O sinal do determinante não afeta a invertibilidade — só importa se ele é diferente de zero.',
  },
  {
    id: 'endless-hard-5',
    kind: 'matrix-builder',
    prompt: 'Construa o resultado de P × Q, célula por célula.',
    operandA: [[2, 0, 1], [1, 3, 4]],
    operandALabel: 'P',
    operatorLabel: '×',
    operandB: [[1, 2], [0, 1], [3, 1]],
    operandBLabel: 'Q',
    solution: multiply([[2, 0, 1], [1, 3, 4]], [[1, 2], [0, 1], [3, 1]]),
    explanation: 'Cada célula é a linha de P multiplicada pela coluna de Q, somando os produtos: (2×1)+(0×0)+(1×3) = 5.',
  },
  {
    id: 'endless-hard-6',
    kind: 'multiple-choice',
    prompt: 'Sabendo que R abaixo satisfaz R² = I, qual é o valor de R⁶?',
    context: [{ label: 'R', matrix: [[0, -1], [-1, 0]] }],
    choices: [
      { id: 'a', label: 'I' },
      { id: 'b', label: 'R' },
      { id: 'c', label: '-I' },
      { id: 'd', label: 'R²' },
    ],
    correctChoiceId: 'a',
    explanation: 'R⁶ = (R²)³ = I³ = I — potências altas se reduzem usando a relação R² = I.',
  },
  {
    id: 'endless-hard-7',
    kind: 'multiple-choice',
    prompt: 'Uma matriz ortogonal A sempre satisfaz qual igualdade?',
    choices: [
      { id: 'a', label: 'Aᵀ × A = I' },
      { id: 'b', label: 'A × A = I' },
      { id: 'c', label: 'det(A) = 0' },
      { id: 'd', label: 'A = Aᵀ' },
    ],
    correctChoiceId: 'a',
    explanation: 'Matrizes ortogonais têm transposta igual à inversa, então Aᵀ × A = I.',
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
