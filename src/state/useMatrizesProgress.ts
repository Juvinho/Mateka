import { useCallback, useEffect, useState } from 'react'
import { isToday, isYesterday, toLocalDateStr } from '../lib/dates'

const STORAGE_KEY = 'mateka:matrizes:progress'
const STORAGE_VERSION = 1

export type ExerciseResult = {
  bestAccuracy: number
  attempts: number
  pointsEarned: number
}

export type MatrizesProgressState = {
  version: number
  completedNodeIds: Record<string, true>
  exerciseResults: Record<string, ExerciseResult>
  streak: { count: number; lastPracticedISODate: string | null }
}

const defaultState: MatrizesProgressState = {
  version: STORAGE_VERSION,
  completedNodeIds: {},
  exerciseResults: {},
  streak: { count: 0, lastPracticedISODate: null },
}

function loadState(): MatrizesProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as MatrizesProgressState
    if (parsed.version !== STORAGE_VERSION) return defaultState
    return parsed
  } catch {
    return defaultState
  }
}

function touchStreak(streak: MatrizesProgressState['streak']): MatrizesProgressState['streak'] {
  if (isToday(streak.lastPracticedISODate)) return streak
  const nextCount = isYesterday(streak.lastPracticedISODate) ? streak.count + 1 : 1
  return { count: nextCount, lastPracticedISODate: toLocalDateStr() }
}

export function useMatrizesProgress() {
  const [state, setState] = useState<MatrizesProgressState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Both writers below rebase on a fresh `loadState()` read — not the `prev`
  // React gives us — because this hook is mounted independently in several
  // places at once (App, ModulosPage, ExerciseSessionPage). App's instance in
  // particular never unmounts across hash navigation, so its in-memory
  // `state` goes stale the moment another instance writes; merging onto
  // stale `prev` would silently resurrect and persist that staleness,
  // clobbering fresher progress recorded elsewhere.
  const markLessonSeen = useCallback((lessonId: string) => {
    setState(() => {
      const fresh = loadState()
      if (fresh.completedNodeIds[lessonId]) return fresh
      return { ...fresh, completedNodeIds: { ...fresh.completedNodeIds, [lessonId]: true } }
    })
  }, [])

  const recordExerciseResult = useCallback(
    (setId: string, accuracy: number, setPoints: number) => {
      setState(() => {
        const fresh = loadState()
        const prevResult = fresh.exerciseResults[setId]
        const pointsEarned = Math.max(prevResult?.pointsEarned ?? 0, Math.round(setPoints * accuracy))
        const bestAccuracy = Math.max(prevResult?.bestAccuracy ?? 0, accuracy)
        const attempts = (prevResult?.attempts ?? 0) + 1

        return {
          ...fresh,
          completedNodeIds: { ...fresh.completedNodeIds, [setId]: true },
          exerciseResults: {
            ...fresh.exerciseResults,
            [setId]: { bestAccuracy, attempts, pointsEarned },
          },
          streak: touchStreak(fresh.streak),
        }
      })
    },
    [],
  )

  const isNodeCompleted = useCallback(
    (nodeId: string) => Boolean(state.completedNodeIds[nodeId]),
    [state.completedNodeIds],
  )

  const totalPoints = Object.values(state.exerciseResults).reduce((sum, r) => sum + r.pointsEarned, 0)
  const completedSetCount = Object.keys(state.exerciseResults).length
  const averageAccuracy =
    completedSetCount > 0
      ? Object.values(state.exerciseResults).reduce((sum, r) => sum + r.bestAccuracy, 0) / completedSetCount
      : 0

  return {
    state,
    markLessonSeen,
    recordExerciseResult,
    isNodeCompleted,
    exerciseResults: state.exerciseResults,
    streakCount: state.streak.count,
    totalPoints,
    averageAccuracy,
  }
}
