import type { ModuleConfig } from '../../pages/ModulosPage'
import TrianglePlayground from '../../components/playground/TrianglePlayground'
import { ALL_PLANA_LESSONS, PLANA_UNITS } from './units'
import { PLANA_EXERCISE_SETS } from './exerciseSets'
import { PLANA_TRACK, isNodeUnlocked } from './track'
import { PLANA_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — same reasoning as the other recent modules:
// those land once the module has its own narration audio and a full review set.
export const PLANA_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'geometria-plana',
  name: 'Geometria Plana',
  icon: '△○',
  badge: 'Ensino Médio',
  description: 'Ângulos, triângulos, polígonos e circunferências — geometria clássica, sem coordenadas.',
  units: PLANA_UNITS,
  allLessons: ALL_PLANA_LESSONS,
  exerciseSets: PLANA_EXERCISE_SETS,
  track: PLANA_TRACK,
  isNodeUnlocked,
  endlessBank: PLANA_ENDLESS_BANK,
  PlaygroundComponent: TrianglePlayground,
}
