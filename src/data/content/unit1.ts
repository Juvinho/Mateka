import type { Exercise, Lesson, Unit } from "../types";
import { zeros } from "../../lib/matrixMath";
import { DEFAULT_BOSS_XP, DEFAULT_LESSON_XP } from "../../lib/constants";

const lesson1Exercises: Exercise[] = [
  {
    id: "u1-l1-e1",
    kind: "multiple-choice",
    prompt: "Uma matriz é uma tabela de números organizada em...",
    choices: [
      { id: "a", label: "linhas e colunas" },
      { id: "b", label: "somente uma linha" },
      { id: "c", label: "números soltos, sem ordem" },
      { id: "d", label: "círculos concêntricos" },
    ],
    correctChoiceId: "a",
    explanation: "Uma matriz organiza números em linhas (horizontal) e colunas (vertical).",
  },
  {
    id: "u1-l1-e2",
    kind: "multiple-choice",
    prompt: "Quantas linhas e colunas tem esta matriz?",
    context: [{ label: "A", matrix: [[2, 5, 9], [1, 4, 7]] }],
    choices: [
      { id: "a", label: "3 linhas e 2 colunas" },
      { id: "b", label: "2 linhas e 3 colunas" },
      { id: "c", label: "2 linhas e 2 colunas" },
      { id: "d", label: "5 linhas e 1 coluna" },
    ],
    correctChoiceId: "b",
    explanation: "Contamos primeiro as linhas (de cima a baixo) e depois as colunas (da esquerda para a direita): 2×3.",
  },
  {
    id: "u1-l1-e3",
    kind: "matrix-fill",
    prompt: "Qual é o elemento na linha 2, coluna 3 desta matriz?",
    template: [
      [4, 1, 7],
      [2, 9, null],
      [6, 3, 8],
    ],
    solution: [
      [4, 1, 7],
      [2, 9, 5],
      [6, 3, 8],
    ],
    explanation: "O elemento da linha 2, coluna 3 é chamado a₂₃ e vale 5.",
  },
  {
    id: "u1-l1-e4",
    kind: "multiple-choice",
    prompt: "Uma matriz 3×5 tem quantos elementos ao todo?",
    choices: [
      { id: "a", label: "8" },
      { id: "b", label: "15" },
      { id: "c", label: "35" },
      { id: "d", label: "53" },
    ],
    correctChoiceId: "b",
    explanation: "Multiplicamos o número de linhas pelo de colunas: 3 × 5 = 15.",
  },
  {
    id: "u1-l1-e5",
    kind: "multiple-choice",
    prompt: "Dizer que uma matriz é \"4×2\" significa que ela tem...",
    choices: [
      { id: "a", label: "4 linhas e 2 colunas" },
      { id: "b", label: "2 linhas e 4 colunas" },
      { id: "c", label: "4 colunas e 2 linhas" },
      { id: "d", label: "4 elementos e 2 linhas" },
    ],
    correctChoiceId: "a",
    explanation: "A convenção é sempre linhas × colunas.",
  },
];

const lesson2Exercises: Exercise[] = [
  {
    id: "u1-l2-e1",
    kind: "multiple-choice",
    prompt: "Como se chama uma matriz que tem o mesmo número de linhas e colunas?",
    context: [{ label: "A", matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }],
    choices: [
      { id: "a", label: "matriz quadrada" },
      { id: "b", label: "matriz linha" },
      { id: "c", label: "matriz nula" },
      { id: "d", label: "matriz coluna" },
    ],
    correctChoiceId: "a",
    explanation: "Como tem 3 linhas e 3 colunas, essa matriz é quadrada (3×3).",
  },
  {
    id: "u1-l2-e2",
    kind: "multiple-choice",
    prompt: "Como se chama uma matriz que tem apenas uma linha?",
    context: [{ label: "B", matrix: [[2, 4, 6, 8]] }],
    choices: [
      { id: "a", label: "matriz coluna" },
      { id: "b", label: "matriz quadrada" },
      { id: "c", label: "matriz linha" },
      { id: "d", label: "matriz nula" },
    ],
    correctChoiceId: "c",
    explanation: "Com 1 linha e várias colunas (1×4), é uma matriz linha.",
  },
  {
    id: "u1-l2-e3",
    kind: "multiple-choice",
    prompt: "Como se chama uma matriz que tem apenas uma coluna?",
    context: [{ label: "C", matrix: [[3], [7], [1]] }],
    choices: [
      { id: "a", label: "matriz linha" },
      { id: "b", label: "matriz coluna" },
      { id: "c", label: "matriz quadrada" },
      { id: "d", label: "matriz nula" },
    ],
    correctChoiceId: "b",
    explanation: "Com várias linhas e 1 coluna (3×1), é uma matriz coluna.",
  },
  {
    id: "u1-l2-e4",
    kind: "multiple-choice",
    prompt: "Uma matriz nula é aquela em que...",
    choices: [
      { id: "a", label: "todos os elementos são zero" },
      { id: "b", label: "todos os elementos são iguais a 1" },
      { id: "c", label: "ela não tem linhas nem colunas" },
      { id: "d", label: "só a diagonal tem números" },
    ],
    correctChoiceId: "a",
    explanation: "Matriz nula: todos os elementos valem 0, mas ela ainda tem dimensões normais.",
  },
  {
    id: "u1-l2-e5",
    kind: "matrix-fill",
    prompt: "Complete a matriz nula 3×2 (todos os elementos são zero).",
    template: [
      [null, null],
      [null, null],
      [null, null],
    ],
    solution: zeros(3, 2),
    explanation: "Toda matriz nula é preenchida só com zeros, em qualquer dimensão.",
  },
];

const lesson3Exercises: Exercise[] = [
  {
    id: "u1-l3-e1",
    kind: "true-false",
    prompt: "Essa igualdade de matrizes está correta?",
    operandA: [[1, 2], [3, 4]],
    operandALabel: "A",
    claimedResult: [[1, 2], [3, 4]],
    isCorrect: true,
    explanation: "Duas matrizes são iguais quando têm as mesmas dimensões e cada elemento correspondente é igual.",
  },
  {
    id: "u1-l3-e2",
    kind: "true-false",
    prompt: "Essa igualdade de matrizes está correta?",
    operandA: [[1, 2], [3, 4]],
    operandALabel: "A",
    claimedResult: [[1, 2], [3, 5]],
    isCorrect: false,
    explanation: "O elemento da linha 2, coluna 2 é diferente (4 ≠ 5), então as matrizes não são iguais.",
  },
  {
    id: "u1-l3-e3",
    kind: "matrix-fill",
    prompt: "Qual é o elemento na linha 3, coluna 1 desta matriz?",
    template: [
      [5, 2, 0],
      [1, 8, 4],
      [null, 6, 3],
    ],
    solution: [
      [5, 2, 0],
      [1, 8, 4],
      [9, 6, 3],
    ],
    explanation: "O elemento a₃₁ (linha 3, coluna 1) vale 9.",
  },
  {
    id: "u1-l3-e4",
    kind: "multiple-choice",
    prompt: "Duas matrizes só podem ser consideradas iguais se...",
    choices: [
      { id: "a", label: "tiverem as mesmas dimensões e os mesmos elementos correspondentes" },
      { id: "b", label: "tiverem a mesma quantidade de elementos, não importa a dimensão" },
      { id: "c", label: "a soma dos elementos for igual" },
      { id: "d", label: "forem as duas matrizes quadradas" },
    ],
    correctChoiceId: "a",
    explanation: "Igualdade de matrizes exige mesma dimensão e mesmos valores, posição por posição.",
  },
  {
    id: "u1-l3-e5",
    kind: "multiple-choice",
    prompt: "Quantas linhas e colunas tem esta matriz?",
    context: [{ label: "D", matrix: [[1], [2], [3], [4]] }],
    choices: [
      { id: "a", label: "1 linha e 4 colunas" },
      { id: "b", label: "4 linhas e 1 coluna" },
      { id: "c", label: "4 linhas e 4 colunas" },
      { id: "d", label: "2 linhas e 2 colunas" },
    ],
    correctChoiceId: "b",
    explanation: "São 4 linhas, cada uma com 1 elemento — uma matriz coluna 4×1.",
  },
];

const bossExercises: Exercise[] = [
  {
    id: "u1-boss-e1",
    kind: "multiple-choice",
    prompt: "Quantas linhas e colunas tem esta matriz?",
    context: [{ label: "M", matrix: [[3, 1], [4, 1], [5, 9], [2, 6]] }],
    choices: [
      { id: "a", label: "4 linhas e 2 colunas" },
      { id: "b", label: "2 linhas e 4 colunas" },
      { id: "c", label: "4 linhas e 4 colunas" },
      { id: "d", label: "8 linhas e 1 coluna" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "u1-boss-e2",
    kind: "multiple-choice",
    prompt: "Como se chama uma matriz com o mesmo número de linhas e colunas?",
    choices: [
      { id: "a", label: "matriz linha" },
      { id: "b", label: "matriz quadrada" },
      { id: "c", label: "matriz coluna" },
      { id: "d", label: "matriz nula" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "u1-boss-e3",
    kind: "matrix-fill",
    prompt: "Qual é o elemento na linha 1, coluna 2 desta matriz?",
    template: [
      [7, null, 2],
      [0, 5, 1],
    ],
    solution: [
      [7, 4, 2],
      [0, 5, 1],
    ],
  },
  {
    id: "u1-boss-e4",
    kind: "true-false",
    prompt: "Essa igualdade de matrizes está correta?",
    operandA: [[0, 2, 4], [1, 3, 5]],
    operandALabel: "A",
    claimedResult: [[0, 2, 4], [1, 3, 6]],
    isCorrect: false,
  },
  {
    id: "u1-boss-e5",
    kind: "multiple-choice",
    prompt: "Uma matriz nula 2×3 tem quantos elementos e qual é o valor de cada um?",
    choices: [
      { id: "a", label: "6 elementos, todos zero" },
      { id: "b", label: "5 elementos, todos zero" },
      { id: "c", label: "6 elementos, todos um" },
      { id: "d", label: "2 elementos, todos zero" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "u1-boss-e6",
    kind: "matrix-fill",
    prompt: "Complete a matriz nula 2×2.",
    template: [
      [null, null],
      [null, null],
    ],
    solution: zeros(2, 2),
  },
];

const lessons: Lesson[] = [
  {
    id: "u1-l1",
    unitId: "unit-1",
    order: 1,
    title: "O que é uma matriz?",
    type: "lesson",
    xpReward: DEFAULT_LESSON_XP,
    exercises: lesson1Exercises,
  },
  {
    id: "u1-l2",
    unitId: "unit-1",
    order: 2,
    title: "Tipos de matrizes",
    type: "lesson",
    xpReward: DEFAULT_LESSON_XP,
    exercises: lesson2Exercises,
  },
  {
    id: "u1-l3",
    unitId: "unit-1",
    order: 3,
    title: "Localizando e comparando",
    type: "lesson",
    xpReward: DEFAULT_LESSON_XP,
    exercises: lesson3Exercises,
  },
  {
    id: "u1-boss",
    unitId: "unit-1",
    order: 4,
    title: "Desafio: Fundamentos",
    type: "boss",
    xpReward: DEFAULT_BOSS_XP,
    exercises: bossExercises,
  },
];

export const unit1: Unit = {
  id: "unit-1",
  order: 1,
  title: "Fundamentos",
  description: "O que é uma matriz, notação e tipos básicos.",
  lessons,
};
