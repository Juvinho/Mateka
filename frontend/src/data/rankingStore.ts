/**
 * rankingStore.ts
 *
 * Local-first ranking store. Scores are derived from the same localStorage
 * data that useModuleProgress writes, so there is no duplicate storage.
 *
 * Architecture note: This file intentionally separates concerns so that a
 * future backend integration only needs to swap out `loadEntries` / `persist`
 * — the interfaces, reward config, and React hook remain the same.
 *
 * Data shape: one key per module → array of RankingEntry, sorted by score desc.
 */

export type RankingEntry = {
  /** Stable identifier — today device-local UUID, tomorrow backend user ID */
  userId: string
  /** Human-readable label shown in the leaderboard */
  displayName: string
  /** Total score (points from exercise sets + endless mode) */
  totalPoints: number
  /** Total correct answers across all exercise sets and endless mode in this module */
  totalCorrect: number
  /** Total questions answered (used as secondary tie-breaker) */
  totalAnswered: number
  /** Best accuracy across all exercise sets (0-1, tertiary tie-breaker) */
  bestAccuracy: number
  /** ISO date string of last activity (quaternary tie-breaker: earlier date = worse) */
  lastActivityAt: string
  /** Rewards currently held by this entry */
  rewards: string[]
}

const RANKING_STORAGE_KEY = 'mateka:rankings:v1'

function loadAll(): Record<string, RankingEntry[]> {
  try {
    const raw = localStorage.getItem(RANKING_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, RankingEntry[]>
  } catch {
    return {}
  }
}

function persistAll(data: Record<string, RankingEntry[]>): void {
  try {
    localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore write failures
  }
}

/**
 * Deterministic comparator for ranking entries (descending = better rank first).
 * Tie-breaker chain:
 *   1. totalPoints (primary)
 *   2. totalCorrect (secondary)
 *   3. bestAccuracy (tertiary)
 *   4. totalAnswered (quaternary — more answers at same accuracy = more consistent)
 *   5. lastActivityAt (earlier = worse — newer activity wins)
 */
export function compareEntries(a: RankingEntry, b: RankingEntry): number {
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
  if (b.totalCorrect !== a.totalCorrect) return b.totalCorrect - a.totalCorrect
  if (b.bestAccuracy !== a.bestAccuracy) return b.bestAccuracy - a.bestAccuracy
  if (b.totalAnswered !== a.totalAnswered) return b.totalAnswered - a.totalAnswered
  // More recent activity wins tie
  return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
}

/**
 * Synchronizes any existing user progress saved in localStorage by useModuleProgress
 * directly into the rankingStore for the specified module.
 */
export function syncFromModuleProgress(moduleId: string): void {
  try {
    const raw = localStorage.getItem(`mateka:${moduleId}:progress`)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return

    const exerciseResults: Record<string, { bestAccuracy?: number; attempts?: number; pointsEarned?: number }> =
      parsed.exerciseResults || {}
    const endless: Record<string, { totalAnswered?: number; totalCorrect?: number; totalPoints?: number }> =
      parsed.endless || {}

    const exPts = Object.values(exerciseResults).reduce((sum, r) => sum + (r.pointsEarned || 0), 0)
    const endlessPts = Object.values(endless).reduce((sum, e) => sum + (e.totalPoints || 0), 0)
    const totalPoints = exPts + endlessPts

    const exAnswered = Object.values(exerciseResults).reduce((sum, r) => sum + (r.attempts || 0), 0)
    const endlessAnswered = Object.values(endless).reduce((sum, e) => sum + (e.totalAnswered || 0), 0)
    const totalAnswered = exAnswered + endlessAnswered

    const exCorrect = Object.values(exerciseResults).reduce(
      (sum, r) => sum + Math.round((r.bestAccuracy || 0) * (r.attempts || 1)),
      0,
    )
    const endlessCorrect = Object.values(endless).reduce((sum, e) => sum + (e.totalCorrect || 0), 0)
    const totalCorrect = exCorrect + endlessCorrect

    const bestAccuracy = Object.values(exerciseResults).reduce(
      (max, r) => Math.max(max, r.bestAccuracy || 0),
      0,
    )

    if (totalPoints > 0 || totalAnswered > 0) {
      const userId = getLocalUserId()
      const displayName = getLocalDisplayName()
      upsertLocalEntry(moduleId, userId, displayName, {
        totalPoints,
        totalCorrect,
        totalAnswered,
        bestAccuracy,
      })
    }
  } catch {
    // ignore parse/storage errors
  }
}

export function getModuleRanking(moduleId: string): RankingEntry[] {
  syncFromModuleProgress(moduleId)
  const all = loadAll()
  return (all[moduleId] ?? []).slice().sort(compareEntries)
}

/**
 * Upserts a ranking entry for the local user in the given module.
 * Called after every exercise session or endless answer to keep rankings live.
 */
export function upsertLocalEntry(
  moduleId: string,
  userId: string,
  displayName: string,
  update: Pick<RankingEntry, 'totalPoints' | 'totalCorrect' | 'totalAnswered' | 'bestAccuracy'>,
): void {
  const all = loadAll()
  const entries: RankingEntry[] = all[moduleId] ?? []
  const idx = entries.findIndex((e) => e.userId === userId)

  const entry: RankingEntry = {
    userId,
    displayName,
    ...update,
    lastActivityAt: new Date().toISOString(),
    rewards: [],
  }

  if (idx >= 0) {
    entry.rewards = entries[idx].rewards // preserve existing rewards
    entries[idx] = entry
  } else {
    entries.push(entry)
  }

  const sorted = entries.sort(compareEntries)
  all[moduleId] = sorted
  persistAll(all)
}

/**
 * Returns or creates a stable local user ID for the current device.
 * When a real auth backend is added, substitute the authenticated user's ID.
 */
export function getLocalUserId(): string {
  const KEY = 'mateka:local-user-id'
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = `local-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return 'local-unknown'
  }
}

/**
 * Returns or creates a display name for the current local user.
 */
export function getLocalDisplayName(): string {
  const KEY = 'mateka:local-display-name'
  try {
    let name = localStorage.getItem(KEY)
    if (!name) {
      const suffix = Math.floor(Math.random() * 9000 + 1000)
      name = `Estudante #${suffix}`
      localStorage.setItem(KEY, name)
    }
    return name
  } catch {
    return 'Estudante'
  }
}
