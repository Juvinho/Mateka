import { useCallback, useRef } from 'react'
import { useOneTimeFlag } from './useOneTimeFlag'
import type { ReactionKey } from '../data/mascotReactions'

type AnswerReaction = Extract<
  ReactionKey,
  'primeiro-acerto' | 'tentar-novamente' | 'promessa' | 'promessa-falhou' | 'recaptular'
>

// Show the mascot on roughly every 3rd wrong answer, not every single one —
// she still tracks streaks/repeats on every wrong answer underneath, but only
// surfaces on the throttled ones so she doesn't show up on every mistake.
const MASCOT_SHOW_EVERY_N_WRONG = 3

/**
 * Tracks, per exercise session (resets whenever the owning component
 * remounts — a fresh exercise set or a fresh Endless session), which
 * mascot reaction (if any) a just-graded answer should trigger:
 *
 *  - wrong + same exercise id missed before  -> 'tentar-novamente'
 *  - wrong + 1st in a fresh mistake streak    -> 'promessa'
 *  - wrong + 2nd in a row (broke the promise) -> 'promessa-falhou'
 *  - wrong + 3rd+ in a row                    -> 'recaptular'
 *  - correct + never answered anything right  -> 'primeiro-acerto' (once ever)
 *
 * Wrong-answer reactions are throttled to every Nth wrong answer in the
 * session (see MASCOT_SHOW_EVERY_N_WRONG) — streak/repeat bookkeeping still
 * runs on every wrong answer so the logic stays consistent, it just doesn't
 * surface a toast every time.
 */
export function useMascotReactionTrigger() {
  const wrongIdsRef = useRef<Set<string>>(new Set())
  const wrongStreakRef = useRef(0)
  const wrongCountRef = useRef(0)
  const { hasSeen: hasSeenFirstCorrect, markSeen: markFirstCorrectSeen } = useOneTimeFlag(
    'mateka:matrizes:firstCorrectSeen',
  )

  const registerAnswer = useCallback(
    (exerciseId: string, correct: boolean): AnswerReaction | null => {
      if (correct) {
        wrongStreakRef.current = 0
        if (!hasSeenFirstCorrect) {
          markFirstCorrectSeen()
          return 'primeiro-acerto'
        }
        return null
      }

      const isRepeat = wrongIdsRef.current.has(exerciseId)
      wrongIdsRef.current.add(exerciseId)
      wrongStreakRef.current += 1
      wrongCountRef.current += 1

      if (wrongCountRef.current % MASCOT_SHOW_EVERY_N_WRONG !== 0) return null

      if (isRepeat) return 'tentar-novamente'
      if (wrongStreakRef.current === 1) return 'promessa'
      if (wrongStreakRef.current === 2) return 'promessa-falhou'
      return 'recaptular'
    },
    [hasSeenFirstCorrect, markFirstCorrectSeen],
  )

  return { registerAnswer }
}
