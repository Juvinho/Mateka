import { useCallback, useMemo, useState } from 'react'

type ProgressRecord = {
  acertos: number
  tentativas: number
  streak: number
  ultimaRevisao: string
}

export type ModuleProgressMap = Record<string, ProgressRecord>

const STORAGE_KEY = 'mateka:progresso'

const readProgress = (): ModuleProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ModuleProgressMap
    return parsed ?? {}
  } catch {
    return {}
  }
}

export const useSpacedRepetition = () => {
  const [progress, setProgress] = useState<ModuleProgressMap>(() => readProgress())

  const save = useCallback((next: ModuleProgressMap): void => {
    setProgress(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const registerAttempt = useCallback(
    (moduleId: string, correct: boolean): void => {
      const previous = progress[moduleId] ?? {
        acertos: 0,
        tentativas: 0,
        streak: 0,
        ultimaRevisao: new Date().toISOString(),
      }

      const updated: ProgressRecord = {
        acertos: previous.acertos + (correct ? 1 : 0),
        tentativas: previous.tentativas + 1,
        streak: correct ? previous.streak + 1 : 0,
        ultimaRevisao: new Date().toISOString(),
      }

      save({
        ...progress,
        [moduleId]: updated,
      })
    },
    [progress, save],
  )

  const completion = useMemo(() => {
    const values = Object.values(progress)
    if (!values.length) return 0

    const total = values.reduce((acc, item) => acc + item.acertos, 0)
    const attempts = values.reduce((acc, item) => acc + item.tentativas, 0)

    return attempts === 0 ? 0 : total / attempts
  }, [progress])

  return {
    progress,
    completion,
    registerAttempt,
  }
}
