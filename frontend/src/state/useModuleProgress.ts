import { useCallback, useEffect, useState } from 'react'
import { isToday, isYesterday, toLocalDateStr } from '../lib/dates'
import type { Difficulty } from '../data/exerciseTypes'
import type { ReactionKey } from '../data/mascotReactions'

const STORAGE_VERSION = 3

type SetCompletionReaction = Extract<ReactionKey, 'alegria-modulo' | 'alegria-modulo-2'>
type EndlessReaction = Extract<ReactionKey, 'endless'>

export type ExerciseResult = {
  bestAccuracy: number
  attempts: number
  pointsEarned: number
}

export type EndlessStats = {
  totalAnswered: number
  totalCorrect: number
  totalPoints: number
}

export type ModuleProgressState = {
  version: number
  completedNodeIds: Record<string, true>
  exerciseResults: Record<string, ExerciseResult>
  endless: Record<Difficulty, EndlessStats>
  streak: { count: number; lastPracticedISODate: string | null }
  perfectSetStreak: number
  endlessMilestoneSeen: boolean
}

const defaultEndlessStats: EndlessStats = { totalAnswered: 0, totalCorrect: 0, totalPoints: 0 }

const defaultState: ModuleProgressState = {
  version: STORAGE_VERSION,
  completedNodeIds: {},
  exerciseResults: {},
  endless: { easy: { ...defaultEndlessStats }, medium: { ...defaultEndlessStats }, hard: { ...defaultEndlessStats } },
  streak: { count: 0, lastPracticedISODate: null },
  perfectSetStreak: 0,
  endlessMilestoneSeen: false,
}

function storageKeyFor(moduleId: string): string {
  return `mateka:${moduleId}:progress`
}

function loadState(moduleId: string): ModuleProgressState {
  try {
    const raw = localStorage.getItem(storageKeyFor(moduleId))
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as ModuleProgressState
    if (parsed.version !== STORAGE_VERSION) return defaultState
    return parsed
  } catch {
    return defaultState
  }
}

function touchStreak(streak: ModuleProgressState['streak']): ModuleProgressState['streak'] {
  if (isToday(streak.lastPracticedISODate)) return streak
  const nextCount = isYesterday(streak.lastPracticedISODate) ? streak.count + 1 : 1
  return { count: nextCount, lastPracticedISODate: toLocalDateStr() }
}

// The stored `count` only gets corrected the next time the learner actually
// practices (via touchStreak above) — so right after a missed day, before
// any new activity, it would still hold yesterday's (now-broken) number.
// This derives the real, current-as-of-now value instead: alive only while
// the last practice was today or yesterday, 0 the moment a day is skipped
// (Duolingo-style hard reset) — read on every render, not just on write, so
// the profile shows 0 as soon as you open it the day after a miss, not only
// after you practice again.
export function effectiveStreakCount(streak: ModuleProgressState['streak']): number {
  if (isToday(streak.lastPracticedISODate) || isYesterday(streak.lastPracticedISODate)) {
    return streak.count
  }
  return 0
}

// Writes straight to localStorage instead of going through the `state`
// setter's updater callback: React 18 batches and defers that callback, so a
// caller that needs a same-tick return value (the mascot reaction key) would
// always read it before the updater ever ran. Writing here keeps `loadState()`
// authoritative even across several calls fired back-to-back in one tick.
function persist(moduleId: string, next: ModuleProgressState): void {
  try {
    localStorage.setItem(storageKeyFor(moduleId), JSON.stringify(next))
  } catch {
    // ignore write failures (private browsing, storage full, etc.)
  }
}

/**
 * Per-module progress (lessons seen, exercise results, endless stats,
 * streak). Each module gets its own localStorage bucket keyed by `moduleId`
 * (e.g. 'matrizes', 'conceitos-basicos') so completing a lesson in one
 * module never touches another's completed-node map or endless stats.
 *
 * `moduleId` is read once, on mount — this hook doesn't react to it
 * changing later. Callers that can switch modules without unmounting (rare;
 * page-level consumers naturally remount on route change) must force a
 * remount themselves via `key={moduleId}`, otherwise the passive persist
 * effect below would write one module's in-memory state into another
 * module's storage slot.
 */
export function useModuleProgress(moduleId: string) {
  const [state, setState] = useState<ModuleProgressState>(() => loadState(moduleId))

  useEffect(() => {
    persist(moduleId, state)
  }, [moduleId, state])

  // All writers below rebase on a fresh `loadState()` read — not the `prev`
  // React gives us — because this hook is mounted independently in several
  // places at once (App, ModulosPage, ExerciseSessionPage, EndlessSessionPage).
  // App's instance in particular never unmounts across hash navigation, so its
  // in-memory `state` goes stale the moment another instance writes; merging
  // onto stale `prev` would silently resurrect and persist that staleness,
  // clobbering fresher progress recorded elsewhere.
  const markLessonSeen = useCallback((lessonId: string) => {
    setState(() => {
      const fresh = loadState(moduleId)
      if (fresh.completedNodeIds[lessonId]) return fresh
      return { ...fresh, completedNodeIds: { ...fresh.completedNodeIds, [lessonId]: true } }
    })
  }, [moduleId])

  const recordExerciseResult = useCallback(
    (setId: string, accuracy: number, setPoints: number): SetCompletionReaction | null => {
      const fresh = loadState(moduleId)
      const prevResult = fresh.exerciseResults[setId]
      const pointsEarned = Math.max(prevResult?.pointsEarned ?? 0, Math.round(setPoints * accuracy))
      const bestAccuracy = Math.max(prevResult?.bestAccuracy ?? 0, accuracy)
      const attempts = (prevResult?.attempts ?? 0) + 1

      const isPerfect = accuracy >= 1
      const nextPerfectStreak = isPerfect ? fresh.perfectSetStreak + 1 : 0
      let reaction: SetCompletionReaction | null = null
      if (isPerfect && nextPerfectStreak === 1) reaction = 'alegria-modulo'
      else if (isPerfect && nextPerfectStreak === 2) reaction = 'alegria-modulo-2'

      const next: ModuleProgressState = {
        ...fresh,
        completedNodeIds: { ...fresh.completedNodeIds, [setId]: true },
        exerciseResults: {
          ...fresh.exerciseResults,
          [setId]: { bestAccuracy, attempts, pointsEarned },
        },
        streak: touchStreak(fresh.streak),
        perfectSetStreak: nextPerfectStreak,
      }
      persist(moduleId, next)
      setState(next)
      return reaction
    },
    [moduleId],
  )

  const recordEndlessAnswer = useCallback(
    (difficulty: Difficulty, correct: boolean): EndlessReaction | null => {
      const fresh = loadState(moduleId)
      const prevStats = fresh.endless[difficulty]
      const nextEndless = {
        ...fresh.endless,
        [difficulty]: {
          totalAnswered: prevStats.totalAnswered + 1,
          totalCorrect: prevStats.totalCorrect + (correct ? 1 : 0),
          totalPoints: prevStats.totalPoints + (correct ? 5 : 0),
        },
      }

      let reaction: EndlessReaction | null = null
      let endlessMilestoneSeen = fresh.endlessMilestoneSeen
      if (!endlessMilestoneSeen) {
        const totals = Object.values(nextEndless).reduce(
          (sum, stats) => ({ answered: sum.answered + stats.totalAnswered, correct: sum.correct + stats.totalCorrect }),
          { answered: 0, correct: 0 },
        )
        if (totals.answered >= 50 && totals.correct / totals.answered >= 0.95) {
          reaction = 'endless'
          endlessMilestoneSeen = true
        }
      }

      const next: ModuleProgressState = {
        ...fresh,
        endless: nextEndless,
        streak: touchStreak(fresh.streak),
        endlessMilestoneSeen,
      }
      persist(moduleId, next)
      setState(next)
      return reaction
    },
    [moduleId],
  )

  const isNodeCompleted = useCallback(
    (nodeId: string) => Boolean(state.completedNodeIds[nodeId]),
    [state.completedNodeIds],
  )

  // Lifetime total: every point ever earned in this module, from regular
  // exercises AND Endless — both accumulate via Math.max/increment-only
  // writers above, so this only ever grows, never shrinks (points aren't
  // tied to the streak and don't reset with it).
  const exercisePoints = Object.values(state.exerciseResults).reduce((sum, r) => sum + r.pointsEarned, 0)
  const endlessPoints = Object.values(state.endless).reduce((sum, e) => sum + e.totalPoints, 0)
  const totalPoints = exercisePoints + endlessPoints
  const completedSetCount = Object.keys(state.exerciseResults).length
  const averageAccuracy =
    completedSetCount > 0
      ? Object.values(state.exerciseResults).reduce((sum, r) => sum + r.bestAccuracy, 0) / completedSetCount
      : 0

  return {
    state,
    markLessonSeen,
    recordExerciseResult,
    recordEndlessAnswer,
    isNodeCompleted,
    exerciseResults: state.exerciseResults,
    endless: state.endless,
    streakCount: effectiveStreakCount(state.streak),
    totalPoints,
    averageAccuracy,
  }
}
