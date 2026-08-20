import { multiply } from '../../lib/matrixMath'
import type { Exercise, ExerciseSet } from '../exerciseTypes'

const S = [[2, 0], [0, 2]]
const P = [[3], [1]]
const P2 = [[4], [5]]

const aplicacoesExercises: Exercise[] = [
  {
    id: 'u6-e1',
    kind: 'matrix-fill',
    prompt: 'Aplique a matriz de escala S ao ponto P = (3, 1). Complete o resultado (S × P).',
    context: [
      { label: 'S', matrix: S },
      { label: 'P', matrix: P },
    ],
    template: [[6], [null]],
    solution: multiply(S, P),
    explanation: 'S dobra cada coordenada: (3,1) vira (6,2) — o ponto se afasta da origem mantendo a direção.',
  },
  {
    id: 'u6-e2',
    kind: 'multiple-choice',
    prompt: 'A matriz [[1, 0], [0, -1]] aplicada a um ponto (x, y) faz o quê?',
    choices: [
      { id: 'a', label: 'reflete o ponto no eixo x (inverte o sinal de y)' },
      { id: 'b', label: 'reflete o ponto no eixo y' },
      { id: 'c', label: 'gira o ponto 90°' },
      { id: 'd', label: 'dobra o tamanho do ponto' },
    ],
    correctChoiceId: 'a',
    explanation: 'x fica igual (multiplicado por 1) e y troca de sinal (multiplicado por -1) — isso espelha o ponto no eixo x.',
  },
  {
    id: 'u6-e3',
    kind: 'multiple-choice',
    prompt: 'Numa matriz de adjacência de um grafo, o que significa um 1 na posição (i, j)?',
    choices: [
      { id: 'a', label: 'existe uma conexão entre os nós i e j' },
      { id: 'b', label: 'não existe conexão entre os nós i e j' },
      { id: 'c', label: 'o nó i tem peso j' },
      { id: 'd', label: 'o grafo tem exatamente j nós' },
    ],
    correctChoiceId: 'a',
    explanation: 'Matrizes de adjacência marcam com 1 as posições onde existe uma aresta (conexão) entre dois nós, e 0 onde não existe.',
  },
  {
    id: 'u6-e4',
    kind: 'true-false',
    prompt: 'Essa aplicação da escala S ao ponto P2 = (4, 5) está correta?',
    operandA: S,
    operandALabel: 'S',
    operatorLabel: '×',
    operandB: P2,
    operandBLabel: 'P2',
    claimedResult: [[8], [9]],
    isCorrect: false,
    explanation: 'S dobra cada coordenada: (4,5) deveria virar (8,10), não (8,9).',
  },
  {
    id: 'u6-e5',
    kind: 'multiple-choice',
    prompt: 'Uma matriz de rotação, multiplicada por um ponto, faz o quê?',
    choices: [
      { id: 'a', label: 'gira o ponto ao redor da origem' },
      { id: 'b', label: 'aumenta o tamanho do ponto' },
      { id: 'c', label: 'apaga o ponto' },
      { id: 'd', label: 'duplica as coordenadas do ponto' },
    ],
    correctChoiceId: 'a',
    explanation: 'Matrizes de rotação preservam a distância até a origem, mudando apenas o ângulo — é assim que jogos e animações giram objetos.',
  },
]

export const unit6ExerciseSets: ExerciseSet[] = [
  {
    id: 'ex-aplicacoes',
    unitNumber: 6,
    icon: '↻',
    difficulty: 'medium',
    title: 'Aplicações Reais',
    description: 'Transformações geométricas e matrizes de adjacência em grafos.',
    points: 60,
    exercises: aplicacoesExercises,
  },
]
