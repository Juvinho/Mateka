import type { ModuleConfig } from '../../pages/ModulosPage'
import { ALL_BASICOS_LESSONS, BASICOS_UNITS } from './units'
import { basicosExerciseSets } from './exerciseSets'
import { TRACK, isNodeUnlocked } from './track'
import { BASICOS_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — those land once the module has its own
// narration audio and a full 3-question review set to draw from.
export const BASICOS_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'conceitos-basicos',
  name: 'Conceitos Básicos',
  icon: '∑',
  badge: 'Ensino Médio',
  description: 'Conjuntos numéricos, operações e a reta numérica — a base para tudo que vem depois.',
  units: BASICOS_UNITS,
  allLessons: ALL_BASICOS_LESSONS,
  exerciseSets: basicosExerciseSets,
  track: TRACK,
  isNodeUnlocked,
  endlessBank: BASICOS_ENDLESS_BANK,
}
