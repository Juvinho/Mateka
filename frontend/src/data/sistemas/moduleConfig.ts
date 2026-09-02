import type { ModuleConfig } from '../../pages/ModulosPage'
import SystemPlayground from '../../components/playground/SystemPlayground'
import { ALL_SISTEMAS_LESSONS, SISTEMAS_UNITS } from './units'
import { SISTEMAS_EXERCISE_SETS } from './exerciseSets'
import { SISTEMAS_TRACK, isNodeUnlocked } from './track'
import { SISTEMAS_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — same reasoning as Conceitos Básicos and
// Pré-Cálculo: those land once the module has its own narration audio and a
// full review set.
export const SISTEMAS_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'sistemas-lineares',
  name: 'Sistemas Lineares',
  icon: 'Ax=b',
  badge: 'Ensino Médio',
  description: 'Substituição, adição, gráficos, escalonamento e Regra de Cramer — todos os caminhos para resolver um sistema linear.',
  units: SISTEMAS_UNITS,
  allLessons: ALL_SISTEMAS_LESSONS,
  exerciseSets: SISTEMAS_EXERCISE_SETS,
  track: SISTEMAS_TRACK,
  isNodeUnlocked,
  endlessBank: SISTEMAS_ENDLESS_BANK,
  PlaygroundComponent: SystemPlayground,
}
