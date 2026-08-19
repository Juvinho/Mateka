import type { LessonTag } from '../../components/modules/LessonCard'
import {
  det2,
  formatMatrix,
  identity,
  inverse2,
  multiply,
  scalarMul,
  sum,
  transpose,
  type Matrix,
} from '../../lib/matrixMath'

export type LessonExample = { label: string; matrix: Matrix }

export type LessonContent = {
  id: string
  title: string
  description: string
  tags: LessonTag[]
  duration: number
  intro: string[]
  examples?: LessonExample[]
  after?: string[]
  exerciseSetId: string
}

export type UnitContent = {
  number: number
  title: string
  lessons: LessonContent[]
}

const opsA = [[1, 2], [3, 4]]
const opsB = [[5, 6], [7, 8]]

const multA = [[1, 2], [3, 4]]
const multB = [[5, 6], [7, 8]]

const detI3 = identity(3)
const detA = [[1, 2, 3], [4, 5, 6]]

const invA = [[4, 7], [2, 6]]
const invAinv = inverse2(invA) as Matrix

const appScale = [[2, 0], [0, 2]]
const appPoint = [[3], [1]]

export const MATRIZES_UNITS: UnitContent[] = [
  {
    number: 1,
    title: 'Fundamentos',
    lessons: [
      {
        id: 'matriz-1',
        title: 'O que é uma matriz?',
        description: 'Notação, dimensão m×n e como localizar cada elemento.',
        tags: ['Interativo', 'Exercício'],
        duration: 8,
        intro: [
          'Uma matriz é uma tabela retangular de números organizada em linhas (horizontais) e colunas (verticais).',
          'Dizemos que uma matriz tem dimensão m × n quando ela tem m linhas e n colunas. A matriz A abaixo tem 2 linhas e 3 colunas, então é 2×3.',
        ],
        examples: [{ label: 'A', matrix: [[2, 5, 9], [1, 4, 7]] }],
        after: ['Cada número dentro da matriz é um elemento, e sua posição é dada por aᵢⱼ — i é a linha, j é a coluna. Aqui, a₂₃ = 7.'],
        exerciseSetId: 'ex-fundamentos',
      },
      {
        id: 'matriz-2',
        title: 'Tipos de matrizes',
        description: 'Matriz quadrada, linha, coluna e nula.',
        tags: ['Interativo', 'Exercício'],
        duration: 8,
        intro: [
          'Existem alguns tipos especiais de matrizes que aparecem com frequência.',
          'Matriz quadrada: tem o mesmo número de linhas e colunas (n×n), como a matriz A abaixo.',
        ],
        examples: [{ label: 'A', matrix: [[1, 2], [3, 4]] }],
        after: ['Matriz linha tem apenas 1 linha; matriz coluna tem apenas 1 coluna. Matriz nula tem todos os elementos iguais a zero, não importa a dimensão.'],
        exerciseSetId: 'ex-tipos',
      },
      {
        id: 'matriz-3',
        title: 'Localizando e comparando',
        description: 'Notação aᵢⱼ e quando duas matrizes são iguais.',
        tags: ['Interativo', 'Exercício'],
        duration: 8,
        intro: ['Para localizar um elemento, usamos a notação aᵢⱼ: primeiro a linha, depois a coluna. Veja a matriz A abaixo.'],
        examples: [{ label: 'A', matrix: [[4, 1, 7], [2, 9, 5], [6, 3, 8]] }],
        after: ['Duas matrizes são iguais quando têm exatamente as mesmas dimensões e cada elemento correspondente é igual, posição por posição — nunca só porque "parecem" iguais.'],
        exerciseSetId: 'ex-localizacao',
      },
    ],
  },
  {
    number: 2,
    title: 'Operações Básicas',
    lessons: [
      {
        id: 'op-basicas',
        title: 'Soma, subtração e multiplicação por escalar',
        description: 'Combine matrizes de mesma dimensão elemento a elemento.',
        tags: ['Interativo', 'Exercício'],
        duration: 12,
        intro: [
          'Duas matrizes com a mesma dimensão podem ser somadas ou subtraídas: basta somar (ou subtrair) os elementos que ocupam a mesma posição.',
        ],
        examples: [
          { label: 'A', matrix: opsA },
          { label: 'B', matrix: opsB },
        ],
        after: [
          `A + B = ${formatMatrix(sum(opsA, opsB))} — cada posição soma A e B naquela posição.`,
          `Multiplicar por um escalar significa multiplicar TODOS os elementos por esse número: 2A = ${formatMatrix(scalarMul(2, opsA))}.`,
        ],
        exerciseSetId: 'ex-operacoes',
      },
    ],
  },
  {
    number: 3,
    title: 'Multiplicação de Matrizes',
    lessons: [
      {
        id: 'mult-matrizes',
        title: 'Multiplicação linha por coluna',
        description: 'A operação que mais confunde — e como visualizá-la.',
        tags: ['Interativo', 'Exercício'],
        duration: 15,
        intro: [
          'Multiplicar matrizes não é como somar: cada elemento do resultado vem de multiplicar uma LINHA inteira de A por uma COLUNA inteira de B, somando os produtos.',
          'Só é possível multiplicar A (m×n) por B (n×p) se o número de colunas de A for igual ao número de linhas de B. O resultado tem dimensão m×p.',
        ],
        examples: [
          { label: 'A', matrix: multA },
          { label: 'B', matrix: multB },
        ],
        after: [`A × B = ${formatMatrix(multiply(multA, multB))} — o elemento da linha 1, coluna 1 é (1×5)+(2×7) = 19.`],
        exerciseSetId: 'ex-multiplicacao',
      },
    ],
  },
  {
    number: 4,
    title: 'Determinante e Transposta',
    lessons: [
      {
        id: 'det-transposta',
        title: 'Identidade, transposta e determinante',
        description: 'Matrizes especiais e o cálculo do determinante 2×2 e 3×3.',
        tags: ['Interativo', 'Exercício'],
        duration: 15,
        intro: ['A matriz identidade tem 1 na diagonal principal e 0 no resto — ela funciona como o número 1 na multiplicação de matrizes.'],
        examples: [
          { label: 'I₃', matrix: detI3 },
          { label: 'A', matrix: detA },
        ],
        after: [
          `A transposta de A (escrita Aᵀ) troca linhas por colunas: Aᵀ = ${formatMatrix(transpose(detA))}.`,
          `O determinante de uma matriz 2×2 [a b; c d] é a·d − b·c. Por exemplo, det([3 8; 4 6]) = 3×6 − 8×4 = ${det2([[3, 8], [4, 6]])}.`,
        ],
        exerciseSetId: 'ex-determinante',
      },
    ],
  },
  {
    number: 5,
    title: 'Inversa e Sistemas Lineares',
    lessons: [
      {
        id: 'inversa-sistemas',
        title: 'Matriz inversa e sistemas lineares',
        description: 'Use a inversa para resolver sistemas de equações.',
        tags: ['Interativo', 'Exercício'],
        duration: 18,
        intro: [
          'A inversa de A (escrita A⁻¹) é a matriz que, multiplicada por A, dá a identidade: A × A⁻¹ = I. Só existe quando o determinante de A não é zero.',
          'Para uma matriz 2×2 [a b; c d], a inversa é (1/det) × [d -b; -c a].',
        ],
        examples: [{ label: 'A', matrix: invA }],
        after: [
          `det(A) = ${det2(invA)}, então A⁻¹ = ${formatMatrix(invAinv)}.`,
          'A inversa serve para resolver sistemas lineares: se A × x = b, então x = A⁻¹ × b.',
        ],
        exerciseSetId: 'ex-inversa',
      },
    ],
  },
  {
    number: 6,
    title: 'Aplicações Reais',
    lessons: [
      {
        id: 'aplicacoes',
        title: 'Transformações geométricas e grafos',
        description: 'Onde matrizes aparecem fora da sala de aula.',
        tags: ['Interativo'],
        duration: 15,
        intro: ['Matrizes também descrevem transformações geométricas: multiplicar um ponto (x,y) por uma matriz de escala ou rotação move ou distorce a figura.'],
        examples: [
          { label: 'S', matrix: appScale },
          { label: 'P', matrix: appPoint },
        ],
        after: [
          `S × P = ${formatMatrix(multiply(appScale, appPoint))} — o ponto (3,1) dobra de tamanho.`,
          'Matrizes também representam grafos: uma matriz de adjacência tem 1 na posição (i,j) se existe uma conexão entre os nós i e j, e 0 caso contrário.',
        ],
        exerciseSetId: 'ex-aplicacoes',
      },
    ],
  },
]

export const ALL_LESSONS: LessonContent[] = MATRIZES_UNITS.flatMap((unit) => unit.lessons)
export const LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lesson.id, lesson]),
)
