import { useCallback, useEffect, useState } from 'react'
import {
  getModuleRanking,
  upsertLocalEntry,
  getLocalUserId,
  getLocalDisplayName,
  type RankingEntry,
} from '../data/rankingStore'
import {
  MODULE_REWARD_CONFIGS,
  getModuleRewardConfig,
} from '../data/rankingConfig'

export type RankedEntry = RankingEntry & {
  position: number
  rewardLabel?: string
  rewardIcon?: string
}

export type ModuleRanking = {
  moduleId: string
  moduleName: string
  icon?: string
  badge?: string
  entries: RankedEntry[]
}

function buildRankedEntries(moduleId: string, raw: RankingEntry[]): RankedEntry[] {
  const rewardConfig = getModuleRewardConfig(moduleId)
  return raw.map((entry, idx) => {
    const position = idx + 1
    const tier = rewardConfig.tiers.find((t) => t.position === position)
    return {
      ...entry,
      position,
      rewardLabel: tier?.label,
      rewardIcon: tier?.icon,
    }
  })
}

/**
 * useRanking
 *
 * Reads all module rankings from rankingStore and exposes them as typed arrays.
 * Also provides `syncLocalProgress` — call this after recording exercise results
 * so the local user's entry is kept up-to-date in the leaderboard.
 */
export function useRanking() {
  const [rankings, setRankings] = useState<ModuleRanking[]>([])

  const refresh = useCallback(() => {
    const next = MODULE_REWARD_CONFIGS.map((config) => {
      const raw = getModuleRanking(config.moduleId)
      return {
        moduleId: config.moduleId,
        moduleName: config.moduleName,
        icon: config.icon,
        badge: config.badge,
        entries: buildRankedEntries(config.moduleId, raw),
      }
    })
    setRankings(next)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /**
   * Syncs the local user's progress into the ranking for a given module.
   * Designed to be called right after `recordExerciseResult` or `recordEndlessAnswer`.
   *
   * @param moduleId  The module whose ranking to update
   * @param stats     Aggregated performance numbers from useModuleProgress
   */
  const syncLocalProgress = useCallback(
    (
      moduleId: string,
      stats: {
        totalPoints: number
        totalCorrect: number
        totalAnswered: number
        bestAccuracy: number
      },
    ) => {
      const userId = getLocalUserId()
      const displayName = getLocalDisplayName()
      upsertLocalEntry(moduleId, userId, displayName, stats)
      refresh()
    },
    [refresh],
  )

  const localUserId = getLocalUserId()

  return { rankings, syncLocalProgress, localUserId, refresh }
}
