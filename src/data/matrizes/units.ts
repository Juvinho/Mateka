import type { LessonTag } from '../../components/modules/LessonCard'
import {
  det2,
  formatMatrix,
  identity,
  inverse2,
  multiply,
  scalarMul,
  sum,
  trace,
  transpose,
  type Matrix,
} from '../../lib/matrixMath'

export type LessonExample = { label: string; matrix: Matrix }

export type InteractiveWidget =
  | 'matrix-explorer'
  | 'operations-lab'
  | 'multiplication-lab'
  | 'determinant-lab'
  | 'inverse-lab'
  | 'transform-lab'
  | 'cayley-hamilton-verifier'

export type LessonContent = {
  id: string
  title: string
  description: string
  tags: LessonTag[]
  duration: number
  intro: string[]
  examples?: LessonExample[]
  after?: string[]
  interactiveWidget?: InteractiveWidget
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
        interactiveWidget: 'matrix-explorer',
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
        interactiveWidget: 'operations-lab',
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
        interactiveWidget: 'multiplication-lab',
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
        interactiveWidget: 'determinant-lab',
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
        interactiveWidget: 'inverse-lab',
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
        interactiveWidget: 'transform-lab',
        exerciseSetId: 'ex-aplicacoes',
      },
    ],
  },
  {
    number: 7,
    title: 'Tópicos Avançados',
    lessons: [
      {
        id: 'tipos-avancados',
        title: 'Mais tipos de matrizes',
        description: 'Identidade, binária, triangular e ortogonal.',
        tags: ['Interativo', 'Exercício'],
        duration: 14,
        intro: [
          'Além de quadrada, linha, coluna e nula, alguns outros tipos de matriz aparecem com frequência em álgebra linear mais avançada.',
          'Matriz triangular superior: todos os elementos ABAIXO da diagonal principal são zero, como T abaixo. Numa triangular inferior é o contrário — zeros ACIMA da diagonal.',
        ],
        examples: [
          { label: 'I', matrix: identity(3) },
          { label: 'T', matrix: [[2, 5, 1], [0, 3, 4], [0, 0, 1]] },
        ],
        after: [
          'Matriz binária: todos os elementos são 0 ou 1, como B = [1 0 1; 0 1 0; 1 1 0] — muito usada para representar grafos e conexões.',
          `Matriz ortogonal: uma matriz quadrada A é ortogonal quando Aᵀ × A = I. Por exemplo, com A = ${formatMatrix([[0, 1], [1, 0]])}, temos Aᵀ × A = ${formatMatrix(multiply(transpose([[0, 1], [1, 0]]), [[0, 1], [1, 0]]))} = I.`,
        ],
        exerciseSetId: 'ex-tipos-avancados',
      },
      {
        id: 'cayley-hamilton',
        title: 'Teorema de Cayley-Hamilton',
        description: 'Toda matriz satisfaz sua própria equação característica.',
        tags: ['Interativo', 'Exercício'],
        duration: 20,
        intro: [
          'O Teorema de Cayley-Hamilton afirma que toda matriz quadrada A é raiz do seu próprio polinômio característico: p(A) = 0.',
          `Para uma matriz 2×2, o polinômio característico é p(λ) = λ² − tr(A)λ + det(A), então p(A) = A² − tr(A)·A + det(A)·I = 0.`,
        ],
        examples: [{ label: 'A', matrix: [[1, 2], [3, 4]] }],
        after: [
          `Para A acima: tr(A) = ${trace([[1, 2], [3, 4]])} e det(A) = ${det2([[1, 2], [3, 4]])}, então A² = 5A + 2I — qualquer potência maior de A pode ser reduzida usando essa relação, sem calcular A³, A⁴... diretamente.`,
          `Isolando a identidade em p(A) = 0 chegamos numa fórmula pronta para a inversa: A⁻¹ = (1/det(A))·(tr(A)·I − A) = ${formatMatrix(inverse2([[1, 2], [3, 4]]) as Matrix)}.`,
          'Mexa nos valores de A abaixo e veja o teorema se confirmando ao vivo — p(A) sempre dá a matriz nula, não importa o que você digitar.',
        ],
        interactiveWidget: 'cayley-hamilton-verifier',
        exerciseSetId: 'ex-cayley-hamilton',
      },
    ],
  },
]

export const ALL_LESSONS: LessonContent[] = MATRIZES_UNITS.flatMap((unit) => unit.lessons)
export const LESSON_BY_ID: Record<string, LessonContent> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lesson.id, lesson]),
)
