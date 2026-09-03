import { useMemo } from 'react'
import { useModuleProgress } from '../state/useModuleProgress'
import { computeAchievements } from '../data/achievements'
import { MATRIZES_MODULE_CONFIG } from '../data/matrizes/moduleConfig'
import { BASICOS_MODULE_CONFIG } from '../data/basicos/moduleConfig'
import { PRECALCULO_MODULE_CONFIG } from '../data/precalculo/moduleConfig'
import { SISTEMAS_MODULE_CONFIG } from '../data/sistemas/moduleConfig'
import { GEOMETRIA_MODULE_CONFIG } from '../data/geometria/moduleConfig'
import { PLANA_MODULE_CONFIG } from '../data/plana/moduleConfig'
import { ESPACIAL_MODULE_CONFIG } from '../data/espacial/moduleConfig'
import type { ModuleOption } from '../components/profile/ModulePickerModal'

// Shared across every page that needs "all of the user's progress at once"
// (PerfilPage, MeusModulosPage, ConquistasPage) — pulled out of PerfilPage so
// three pages don't each carry their own copy of this same aggregation.
export function useAggregatedProgress() {
  const basicosProgress = useModuleProgress('conceitos-basicos')
  const matrizesProgress = useModuleProgress('matrizes')
  const precalculoProgress = useModuleProgress('pre-calculo')
  const sistemasProgress = useModuleProgress('sistemas-lineares')
  const geometriaProgress = useModuleProgress('geometria-analitica')
  const planaProgress = useModuleProgress('geometria-plana')
  const espacialProgress = useModuleProgress('geometria-espacial')

  const totalPoints =
    matrizesProgress.totalPoints +
    basicosProgress.totalPoints +
    precalculoProgress.totalPoints +
    sistemasProgress.totalPoints +
    geometriaProgress.totalPoints +
    planaProgress.totalPoints +
    espacialProgress.totalPoints

  const combinedAccuracy = useMemo(() => {
    const accuracies = [
      matrizesProgress.averageAccuracy,
      basicosProgress.averageAccuracy,
      precalculoProgress.averageAccuracy,
      sistemasProgress.averageAccuracy,
      geometriaProgress.averageAccuracy,
      planaProgress.averageAccuracy,
      espacialProgress.averageAccuracy,
    ].filter((a) => a > 0)
    if (accuracies.length === 0) return 0
    return accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length
  }, [
    matrizesProgress.averageAccuracy,
    basicosProgress.averageAccuracy,
    precalculoProgress.averageAccuracy,
    sistemasProgress.averageAccuracy,
    geometriaProgress.averageAccuracy,
    planaProgress.averageAccuracy,
    espacialProgress.averageAccuracy,
  ])

  const bestStreak = Math.max(
    matrizesProgress.streakCount,
    basicosProgress.streakCount,
    precalculoProgress.streakCount,
    sistemasProgress.streakCount,
    geometriaProgress.streakCount,
    planaProgress.streakCount,
    espacialProgress.streakCount,
  )

  // Single source of truth for "which useModuleProgress result belongs to
  // which module" — used both to build allModules below and to look up the
  // right progress when rendering each started module's card, so a new
  // module can never silently fall through to another one's numbers.
  const progressByModuleId = {
    matrizes: matrizesProgress,
    'conceitos-basicos': basicosProgress,
    'pre-calculo': precalculoProgress,
    'sistemas-lineares': sistemasProgress,
    'geometria-analitica': geometriaProgress,
    'geometria-plana': planaProgress,
    'geometria-espacial': espacialProgress,
  }

  const allModules: ModuleOption[] = [
    { config: BASICOS_MODULE_CONFIG, hash: '#basicos', started: Object.keys(basicosProgress.state.completedNodeIds).length > 0 },
    { config: MATRIZES_MODULE_CONFIG, hash: '#modulos', started: Object.keys(matrizesProgress.state.completedNodeIds).length > 0 },
    { config: PRECALCULO_MODULE_CONFIG, hash: '#pre-calculo', started: Object.keys(precalculoProgress.state.completedNodeIds).length > 0 },
    { config: SISTEMAS_MODULE_CONFIG, hash: '#sistemas-lineares', started: Object.keys(sistemasProgress.state.completedNodeIds).length > 0 },
    { config: GEOMETRIA_MODULE_CONFIG, hash: '#geometria-analitica', started: Object.keys(geometriaProgress.state.completedNodeIds).length > 0 },
    { config: PLANA_MODULE_CONFIG, hash: '#geometria-plana', started: Object.keys(planaProgress.state.completedNodeIds).length > 0 },
    { config: ESPACIAL_MODULE_CONFIG, hash: '#geometria-espacial', started: Object.keys(espacialProgress.state.completedNodeIds).length > 0 },
  ]
  const startedModules = allModules.filter((m) => m.started)

  const achievements = useMemo(() => {
    const matrizesCompletedTrackNodes = MATRIZES_MODULE_CONFIG.track.filter(
      (n) => matrizesProgress.state.completedNodeIds[n.id],
    ).length
    const basicosCompletedTrackNodes = BASICOS_MODULE_CONFIG.track.filter(
      (n) => basicosProgress.state.completedNodeIds[n.id],
    ).length
    const precalculoCompletedTrackNodes = PRECALCULO_MODULE_CONFIG.track.filter(
      (n) => precalculoProgress.state.completedNodeIds[n.id],
    ).length
    const sistemasCompletedTrackNodes = SISTEMAS_MODULE_CONFIG.track.filter(
      (n) => sistemasProgress.state.completedNodeIds[n.id],
    ).length
    const geometriaCompletedTrackNodes = GEOMETRIA_MODULE_CONFIG.track.filter(
      (n) => geometriaProgress.state.completedNodeIds[n.id],
    ).length
    const planaCompletedTrackNodes = PLANA_MODULE_CONFIG.track.filter(
      (n) => planaProgress.state.completedNodeIds[n.id],
    ).length
    const espacialCompletedTrackNodes = ESPACIAL_MODULE_CONFIG.track.filter(
      (n) => espacialProgress.state.completedNodeIds[n.id],
    ).length
    const hasCompletedModule =
      (MATRIZES_MODULE_CONFIG.track.length > 0 && matrizesCompletedTrackNodes === MATRIZES_MODULE_CONFIG.track.length) ||
      (BASICOS_MODULE_CONFIG.track.length > 0 && basicosCompletedTrackNodes === BASICOS_MODULE_CONFIG.track.length) ||
      (PRECALCULO_MODULE_CONFIG.track.length > 0 && precalculoCompletedTrackNodes === PRECALCULO_MODULE_CONFIG.track.length) ||
      (SISTEMAS_MODULE_CONFIG.track.length > 0 && sistemasCompletedTrackNodes === SISTEMAS_MODULE_CONFIG.track.length) ||
      (GEOMETRIA_MODULE_CONFIG.track.length > 0 && geometriaCompletedTrackNodes === GEOMETRIA_MODULE_CONFIG.track.length) ||
      (PLANA_MODULE_CONFIG.track.length > 0 && planaCompletedTrackNodes === PLANA_MODULE_CONFIG.track.length) ||
      (ESPACIAL_MODULE_CONFIG.track.length > 0 && espacialCompletedTrackNodes === ESPACIAL_MODULE_CONFIG.track.length)

    const allResults = [
      ...Object.values(matrizesProgress.state.exerciseResults),
      ...Object.values(basicosProgress.state.exerciseResults),
      ...Object.values(precalculoProgress.state.exerciseResults),
      ...Object.values(sistemasProgress.state.exerciseResults),
      ...Object.values(geometriaProgress.state.exerciseResults),
      ...Object.values(planaProgress.state.exerciseResults),
      ...Object.values(espacialProgress.state.exerciseResults),
    ]
    const totalEndlessAnswered = [
      matrizesProgress.state.endless,
      basicosProgress.state.endless,
      precalculoProgress.state.endless,
      sistemasProgress.state.endless,
      geometriaProgress.state.endless,
      planaProgress.state.endless,
      espacialProgress.state.endless,
    ]
      .flatMap((e) => Object.values(e))
      .reduce((sum, stats) => sum + stats.totalAnswered, 0)

    return computeAchievements({
      totalCompletedNodes:
        Object.keys(matrizesProgress.state.completedNodeIds).length +
        Object.keys(basicosProgress.state.completedNodeIds).length +
        Object.keys(precalculoProgress.state.completedNodeIds).length +
        Object.keys(sistemasProgress.state.completedNodeIds).length +
        Object.keys(geometriaProgress.state.completedNodeIds).length +
        Object.keys(planaProgress.state.completedNodeIds).length +
        Object.keys(espacialProgress.state.completedNodeIds).length,
      startedModuleCount: startedModules.length,
      hasPerfectSet: allResults.some((r) => r.bestAccuracy >= 1),
      bestStreak,
      totalPoints,
      totalEndlessAnswered,
      hasCompletedModule,
    })
  }, [
    matrizesProgress.state,
    basicosProgress.state,
    precalculoProgress.state,
    sistemasProgress.state,
    geometriaProgress.state,
    planaProgress.state,
    espacialProgress.state,
    startedModules.length,
    bestStreak,
    totalPoints,
  ])

  return {
    totalPoints,
    combinedAccuracy,
    bestStreak,
    progressByModuleId,
    allModules,
    startedModules,
    achievements,
  }
}
