import type { ModuleConfig } from '../../pages/ModulosPage'
import CoordinatePlanePlayground from '../../components/playground/CoordinatePlanePlayground'
import { ALL_GEOMETRIA_LESSONS, GEOMETRIA_UNITS } from './units'
import { GEOMETRIA_EXERCISE_SETS } from './exerciseSets'
import { GEOMETRIA_TRACK, isNodeUnlocked } from './track'
import { GEOMETRIA_ENDLESS_BANK } from './endlessBank'

// No quiz or mascot intro yet — same reasoning as the other recent modules:
// those land once the module has its own narration audio and a full review set.
export const GEOMETRIA_MODULE_CONFIG: ModuleConfig = {
  moduleId: 'geometria-analitica',
  name: 'Geometria Analítica',
  icon: '(x,y)',
  badge: 'Ensino Médio',
  description: 'Pontos, retas, circunferências e cônicas — a ponte entre álgebra e geometria.',
  units: GEOMETRIA_UNITS,
  allLessons: ALL_GEOMETRIA_LESSONS,
  exerciseSets: GEOMETRIA_EXERCISE_SETS,
  track: GEOMETRIA_TRACK,
  isNodeUnlocked,
  endlessBank: GEOMETRIA_ENDLESS_BANK,
  PlaygroundComponent: CoordinatePlanePlayground,
}
