import { det2, identity, inverse2, multiply, trace, transpose, type Matrix } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const orthoA = [[0, 1], [1, 0]]

const tiposAvancadosExercises: Exercise[] = [
  {
    id: 'u7a-e1',
    kind: 'multiple-choice',
    prompt: 'Qual é o nome da matriz em que todos os elementos abaixo da diagonal principal são zero?',
    choices: [
      { id: 'a', label: 'triangular superior' },
      { id: 'b', label: 'triangular inferior' },
      { id: 'c', label: 'ortogonal' },
      { id: 'd', label: 'binária' },
    ],
    correctChoiceId: 'a',
    explanation: 'Triangular SUPERIOR: os zeros ficam abaixo da diagonal, deixando a parte de cima "cheia".',
  },
  {
    id: 'u7a-e2',
    kind: 'multiple-choice',
    prompt: 'Uma matriz binária só pode ter quais valores em seus elementos?',
    choices: [
      { id: 'a', label: '0 e 1' },
      { id: 'b', label: '-1 e 1' },
      { id: 'c', label: 'qualquer número inteiro' },
      { id: 'd', label: 'apenas números positivos' },
    ],
    correctChoiceId: 'a',
    explanation: 'Matrizes binárias usam só 0 e 1 — muito comuns para representar grafos e estados verdadeiro/falso.',
  },
  {
    id: 'u7a-e3',
    kind: 'true-false',
    prompt: 'Essa igualdade está correta? (Aᵀ × A deveria dar a identidade se A for ortogonal)',
    operandA: transpose(orthoA),
    operandALabel: 'Aᵀ',
    operatorLabel: '×',
    operandB: orthoA,
    operandBLabel: 'A',
    claimedResult: identity(2),
    isCorrect: true,
    explanation: 'Como Aᵀ × A = I, essa matriz A é de fato ortogonal.',
  },
  {
    id: 'u7a-e4',
    kind: 'matrix-fill',
    prompt: 'Complete a matriz identidade 3×3.',
    template: [
      [1, 0, 0],
      [0, null, 0],
      [0, 0, 1],
    ],
    solution: identity(3),
    explanation: 'A identidade tem 1 na diagonal principal e 0 em todo o resto.',
  },
  {
    id: 'u7a-e5',
    kind: 'multiple-choice',
    prompt: 'Uma matriz triangular inferior tem todos os elementos zero em qual região?',
    choices: [
      { id: 'a', label: 'acima da diagonal principal' },
      { id: 'b', label: 'abaixo da diagonal principal' },
      { id: 'c', label: 'na diagonal principal' },
      { id: 'd', label: 'nas bordas da matriz' },
    ],
    correctChoiceId: 'a',
    explanation: 'Triangular INFERIOR: os zeros ficam acima da diagonal.',
  },
]

const chA = [[6, -2], [4, -1]]
const chB = [[2, -1], [3, -2]]
const chAinv = inverse2(chA) as Matrix

const cayleyHamiltonExercises: Exercise[] = [
  {
    id: 'u7b-e1',
    kind: 'multiple-choice',
    prompt: 'Qual é o polinômio característico de A?',
    context: [{ label: 'A', matrix: chA }],
    choices: [
      { id: 'a', label: `λ² − ${trace(chA)}λ + ${det2(chA)}` },
      { id: 'b', label: `λ² + ${trace(chA)}λ + ${det2(chA)}` },
      { id: 'c', label: `λ² − ${trace(chA)}λ − ${det2(chA)}` },
      { id: 'd', label: `λ² − ${det2(chA)}λ + ${trace(chA)}` },
    ],
    correctChoiceId: 'a',
    explanation: 'p(λ) = λ² − tr(A)λ + det(A). Aqui tr(A) = 5 e det(A) = 2.',
  },
  {
    id: 'u7b-e2',
    kind: 'matrix-fill',
    prompt: 'Use a fórmula A⁻¹ = (1/det(A))·(tr(A)·I − A) para completar a inversa de A.',
    context: [{ label: 'A', matrix: chA }],
    template: [
      [chAinv[0][0], chAinv[0][1]],
      [chAinv[1][0], null],
    ],
    solution: chAinv,
    explanation: 'tr(A)·I − A = [-1 2; -4 6], dividido por det(A) = 2, dá A⁻¹ = [-0.5 1; -2 3].',
  },
  {
    id: 'u7b-e3',
    kind: 'true-false',
    prompt: 'Essa igualdade está correta? (A × A deveria dar a identidade, já que tr(A) = 0 e det(A) = -1)',
    operandA: chB,
    operandALabel: 'A',
    operatorLabel: '×',
    operandB: chB,
    operandBLabel: 'A',
    claimedResult: multiply(chB, chB),
    isCorrect: true,
    explanation: 'Como p(λ) = λ² − 1, o teorema garante que A² = I para essa matriz.',
  },
  {
    id: 'u7b-e4',
    kind: 'multiple-choice',
    prompt: 'O que o Teorema de Cayley-Hamilton afirma?',
    choices: [
      { id: 'a', label: 'toda matriz quadrada satisfaz sua própria equação característica: p(A) = 0' },
      { id: 'b', label: 'toda matriz tem determinante igual a zero' },
      { id: 'c', label: 'toda matriz é igual à sua própria inversa' },
      { id: 'd', label: 'toda matriz quadrada é diagonalizável' },
    ],
    correctChoiceId: 'a',
    explanation: 'Substituindo A no seu próprio polinômio característico, o resultado é sempre a matriz nula.',
  },
  {
    id: 'u7b-e5',
    kind: 'multiple-choice',
    prompt: 'Se uma matriz A (2×2) satisfaz A² = 3A − 2I, quais são tr(A) e det(A) segundo Cayley-Hamilton?',
    choices: [
      { id: 'a', label: 'tr(A) = 3 e det(A) = 2' },
      { id: 'b', label: 'tr(A) = 2 e det(A) = 3' },
      { id: 'c', label: 'tr(A) = -3 e det(A) = -2' },
      { id: 'd', label: 'tr(A) = 3 e det(A) = -2' },
    ],
    correctChoiceId: 'a',
    explanation: 'A² = 3A − 2I equivale a A² − 3A + 2I = 0, que tem a forma λ² − tr(A)λ + det(A) = 0.',
  },
  {
    id: 'u7b-e6',
    kind: 'multiple-choice',
    prompt: 'Sabendo que A² = I para a matriz B abaixo, qual é o valor de A⁴?',
    context: [{ label: 'A', matrix: chB }],
    choices: [
      { id: 'a', label: 'I' },
      { id: 'b', label: 'A' },
      { id: 'c', label: '-I' },
      { id: 'd', label: 'A²' },
    ],
    correctChoiceId: 'a',
    explanation: 'A⁴ = (A²)² = I² = I — potências altas se reduzem usando a relação encontrada pelo teorema.',
  },
]

export const unit7ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-tipos-avancados',
    unitNumber: 7,
    icon: '△',
    difficulty: 'medium',
    title: 'Tipos Avançados de Matrizes',
    description: 'Identidade, binária, triangular e ortogonal.',
    points: 70,
    exercises: tiposAvancadosExercises,
  },
  {
    id: 'ex-cayley-hamilton',
    unitNumber: 7,
    icon: 'p(A)',
    difficulty: 'hard',
    title: 'Cayley-Hamilton',
    description: 'Polinômio característico, inversa e redução de potências.',
    points: 110,
    exercises: cayleyHamiltonExercises,
  },
]
