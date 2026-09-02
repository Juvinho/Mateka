import type { ModuleConfig } from '../../pages/ModulosPage'
import FunctionPlayground from '../../components/playground/FunctionPlayground'
import { ALL_PRECALCULO_LESSONS, PRECALCULO_UNITS } from './units'
import { PRECALCULO_EXERCISE_SETS } from './exerciseSets'
import { PRECALCULO_TRACK, isNodeUnlocked } from './track'
import { PRECALCULO_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — same reasoning as Conceitos Básicos: those
// land once the module has its own narration audio and a full review set.
export const PRECALCULO_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'pre-calculo',
  name: 'Pré-Cálculo',
  icon: 'f(x)',
  badge: 'Ensino Médio',
  description: 'Funções, exponencial, logaritmo e progressões — a ponte entre a matemática básica e o cálculo.',
  units: PRECALCULO_UNITS,
  allLessons: ALL_PRECALCULO_LESSONS,
  exerciseSets: PRECALCULO_EXERCISE_SETS,
  track: PRECALCULO_TRACK,
  isNodeUnlocked,
  endlessBank: PRECALCULO_ENDLESS_BANK,
  PlaygroundComponent: FunctionPlayground,
}
