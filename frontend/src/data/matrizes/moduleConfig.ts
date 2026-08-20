import type { QuizQuestionData } from '../../components/modules/QuizQuestion'
import type { ModuleConfig } from '../../pages/ModulosPage'
import MatrizesIntro from '../../components/mascot/MatrizesIntro'
import { ALL_LESSONS, MATRIZES_UNITS } from './units'
import { ALL_EXERCISE_SETS } from './exerciseSets'
import { TRACK, isNodeUnlocked } from './track'
import { ENDLESS_BANK } from './endlessBank'

const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    id: 'q1',
    number: 1,
    difficulty: 'Fácil',
    question: 'Quantas linhas e colunas tem a matriz A abaixo?',
    matrixLabel: 'A',
    matrix: [[2, 5, 9], [1, 4, 7]],
    options: [
      { letter: 'A', text: '3 linhas e 2 colunas', isCorrect: false },
      { letter: 'B', text: '2 linhas e 3 colunas', isCorrect: true },
      { letter: 'C', text: '2 linhas e 2 colunas', isCorrect: false },
      { letter: 'D', text: '6 linhas e 1 coluna', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    number: 2,
    difficulty: 'Médio',
    question: 'Qual é o elemento a₂₃ (linha 2, coluna 3) da matriz A?',
    matrixLabel: 'A',
    matrix: [[4, 1, 7], [2, 9, 5], [6, 3, 8]],
    options: [
      { letter: 'A', text: '7', isCorrect: false },
      { letter: 'B', text: '5', isCorrect: true },
      { letter: 'C', text: '9', isCorrect: false },
      { letter: 'D', text: '3', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    number: 3,
    difficulty: 'Médio',
    question: 'Como se chama uma matriz que tem o mesmo número de linhas e colunas?',
    matrixLabel: 'A',
    matrix: [[1, 2], [3, 4]],
    options: [
      { letter: 'A', text: 'Matriz quadrada', isCorrect: true },
      { letter: 'B', text: 'Matriz linha', isCorrect: false },
      { letter: 'C', text: 'Matriz nula', isCorrect: false },
      { letter: 'D', text: 'Matriz coluna', isCorrect: false },
    ],
  },
]

export const MATRIZES_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'matrizes',
  name: 'Matrizes',
  icon: '[A]',
  badge: 'Ensino Médio',
  description:
    'Organize números em linhas e colunas e aprenda a somar, multiplicar e transformar matrizes com visualizações interativas.',
  units: MATRIZES_UNITS,
  allLessons: ALL_LESSONS,
  exerciseSets: ALL_EXERCISE_SETS,
  track: TRACK,
  isNodeUnlocked,
  endlessBank: ENDLESS_BANK,
  quizQuestions: QUIZ_QUESTIONS,
  IntroComponent: MatrizesIntro,
}
