import type { ModuleConfig } from '../../pages/ModulosPage'
import CylinderPlayground from '../../components/playground/CylinderPlayground'
import { ALL_ESPACIAL_LESSONS, ESPACIAL_UNITS } from './units'
import { ESPACIAL_EXERCISE_SETS } from './exerciseSets'
import { ESPACIAL_TRACK, isNodeUnlocked } from './track'
import { ESPACIAL_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — same reasoning as the other recent modules:
// those land once the module has its own narration audio and a full review set.
export const ESPACIAL_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'geometria-espacial',
  name: 'Geometria Espacial',
  icon: '⬡³',
  badge: 'Ensino Médio',
  description: 'Prismas, pirâmides, cilindros, cones e esferas — área e volume dos sólidos geométricos.',
  units: ESPACIAL_UNITS,
  allLessons: ALL_ESPACIAL_LESSONS,
  exerciseSets: ESPACIAL_EXERCISE_SETS,
  track: ESPACIAL_TRACK,
  isNodeUnlocked,
  endlessBank: ESPACIAL_ENDLESS_BANK,
  PlaygroundComponent: CylinderPlayground,
}
