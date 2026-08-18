export type MatrizesLessonContent = {
  hash: string
  title: string
  intro: string[]
  example?: { label: string; matrix: number[][] }
  after?: string[]
}

export const MATRIZES_LESSONS: MatrizesLessonContent[] = [
  {
    hash: '#aula-matriz-1',
    title: 'O que é uma matriz?',
    intro: [
      'Uma matriz é uma tabela retangular de números organizada em linhas (horizontais) e colunas (verticais).',
      'Dizemos que uma matriz tem dimensão m × n quando ela tem m linhas e n colunas. A matriz A abaixo tem 2 linhas e 3 colunas, então é 2×3.',
    ],
    example: { label: 'A', matrix: [[2, 5, 9], [1, 4, 7]] },
    after: [
      'Cada número dentro da matriz é um elemento, e sua posição é dada por aᵢⱼ — i é a linha, j é a coluna. Aqui, a₂₃ = 7.',
    ],
  },
  {
    hash: '#aula-matriz-2',
    title: 'Tipos de matrizes',
    intro: [
      'Existem alguns tipos especiais de matrizes que aparecem com frequência.',
      'Matriz quadrada: tem o mesmo número de linhas e colunas (n×n), como a matriz A abaixo.',
    ],
    example: { label: 'A', matrix: [[1, 2], [3, 4]] },
    after: [
      'Matriz linha tem apenas 1 linha; matriz coluna tem apenas 1 coluna. Matriz nula tem todos os elementos iguais a zero, não importa a dimensão.',
    ],
  },
  {
    hash: '#aula-matriz-3',
    title: 'Localizando e comparando',
    intro: [
      'Para localizar um elemento, usamos a notação aᵢⱼ: primeiro a linha, depois a coluna. Veja a matriz A abaixo.',
    ],
    example: { label: 'A', matrix: [[4, 1, 7], [2, 9, 5], [6, 3, 8]] },
    after: [
      'Duas matrizes são iguais quando têm exatamente as mesmas dimensões e cada elemento correspondente é igual, posição por posição — nunca só porque "parecem" iguais.',
    ],
  },
]

export const MATRIZES_LESSON_BY_HASH: Record<string, MatrizesLessonContent> = Object.fromEntries(
  MATRIZES_LESSONS.map((lesson) => [lesson.hash, lesson]),
)
