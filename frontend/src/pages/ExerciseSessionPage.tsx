import { useCallback, useEffect, useRef, useState } from 'react'
import ExerciseRenderer from '../components/exercise/ExerciseRenderer'
import MascotToast from '../components/mascot/MascotToast'
import type { ExerciseSet } from '../data/exerciseTypes'
import { pickHint } from '../data/hints'
import { REACTIONS, type ReactionKey } from '../data/mascotReactions'
import { moduleHubHash } from '../data/moduleRoutes'
import { gradeExercise, type ExerciseAnswer } from '../lib/grading'
import { playCorrectSound, playWrongSound } from '../lib/sfx'
import { useMascotReactionTrigger } from '../state/useMascotReactionTrigger'
import { useModuleProgress } from '../state/useModuleProgress'
import { useRanking } from '../state/useRanking'

type Props = {
  exerciseSet: ExerciseSet
  moduleId: string
  onNavigate: (hash: string) => void
}

const DIFFICULTY_LABEL: Record<ExerciseSet['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const ExerciseSessionPage = ({ exerciseSet, moduleId, onNavigate }: Props) => {
  const [attempt, setAttempt] = useState(0)

  return (
    <ExerciseSessionInner
      key={`${exerciseSet.id}-${attempt}`}
      exerciseSet={exerciseSet}
      moduleId={moduleId}
      onNavigate={onNavigate}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  )
}

type InnerProps = Props & { onRetry: () => void }

type SessionStatus = 'intro' | 'active' | 'results'

const ExerciseSessionInner = ({ exerciseSet, moduleId, onNavigate, onRetry }: InnerProps) => {
  const { recordExerciseResult, exerciseResults, endless } = useModuleProgress(moduleId)
  const { registerAnswer } = useMascotReactionTrigger()
  const { syncLocalProgress } = useRanking()
  const [status, setStatus] = useState<SessionStatus>('intro')
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null)
  const [resultSaved, setResultSaved] = useState(false)
  const [activeReaction, setActiveReaction] = useState<{ key: ReactionKey; nonce: number } | null>(null)
  const reactionNonceRef = useRef(0)

  const triggerReaction = useCallback((key: ReactionKey | null) => {
    if (!key) return
    reactionNonceRef.current += 1
    setActiveReaction({ key, nonce: reactionNonceRef.current })
  }, [])

  const exercises = exerciseSet.exercises
  const currentExercise = exercises[index]

  useEffect(() => {
    if (status !== 'results' || resultSaved) return
    const accuracy = exercises.length > 0 ? correctCount / exercises.length : 0
    const reaction = recordExerciseResult(exerciseSet.id, accuracy, exerciseSet.points)
    triggerReaction(reaction)
    setResultSaved(true)

    // Sync ranking: aggregate all results for this module after the new result persists
    const allResults = { ...exerciseResults, [exerciseSet.id]: { bestAccuracy: accuracy, attempts: 1, pointsEarned: Math.round(exerciseSet.points * accuracy) } }
    const totalCorrect = Object.values(allResults).reduce((sum, r) => sum + Math.round(r.bestAccuracy * exercises.length), 0)
    const totalAnswered = Object.values(allResults).reduce((sum, r) => sum + r.attempts, 0)
    const bestAccuracy = Object.values(allResults).reduce((max, r) => Math.max(max, r.bestAccuracy), 0)
    const exercisePts = Object.values(allResults).reduce((sum, r) => sum + r.pointsEarned, 0)
    const endlessPts = Object.values(endless).reduce((sum, e) => sum + e.totalPoints, 0)
    syncLocalProgress(moduleId, {
      totalPoints: exercisePts + endlessPts,
      totalCorrect,
      totalAnswered,
      bestAccuracy,
    })
  }, [status, resultSaved, correctCount, exercises.length, exerciseSet.id, exerciseSet.points, recordExerciseResult, triggerReaction, syncLocalProgress, moduleId, exerciseResults, endless])


  const handleAnswer = useCallback(
    (answer: ExerciseAnswer) => {
      const correct = gradeExercise(currentExercise, answer)
      if (correct) {
        setCorrectCount((c) => c + 1)
        playCorrectSound()
      } else {
        playWrongSound()
      }
      setFeedback({ correct, explanation: currentExercise.explanation })
      triggerReaction(registerAnswer(currentExercise.id, correct))
    },
    [currentExercise, registerAnswer, triggerReaction],
  )

  const mascotToast = activeReaction && (
    <MascotToast
      key={`${activeReaction.key}-${activeReaction.nonce}`}
      reaction={REACTIONS[activeReaction.key]}
      onDone={() => setActiveReaction(null)}
    />
  )

  const handleContinue = useCallback(() => {
    setFeedback(null)
    const next = index + 1
    if (next >= exercises.length) {
      setStatus('results')
    } else {
      setIndex(next)
    }
  }, [index, exercises.length])

  if (status === 'intro') {
    return (
      <div className="exercise-session-page">
        <div className="exercise-session-shell">
          <div className="exercise-session-card exercise-intro-card">
            <span className={`exercise-difficulty-badge ${exerciseSet.difficulty}`}>
              {DIFFICULTY_LABEL[exerciseSet.difficulty]}
            </span>
            <h1>{exerciseSet.title}</h1>
            <p>{exerciseSet.description}</p>
            <p className="exercise-results-points">
              {exercises.length} questões · +{exerciseSet.points} pts
            </p>
            <button type="button" className="btn-primary" onClick={() => setStatus('active')}>
              Começar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'results') {
    const accuracy = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0
    const pointsEarned = Math.round(exerciseSet.points * (correctCount / Math.max(1, exercises.length)))

    return (
      <div className="exercise-session-page">
        <div className="exercise-session-shell">
          <div className="exercise-session-card exercise-results-card">
            <h1>{accuracy >= 60 ? 'Mandou bem! 🎉' : 'Quase lá!'}</h1>
            <p className="exercise-results-score">
              {correctCount} de {exercises.length} corretas ({accuracy}%)
            </p>
            <p className="exercise-results-points">+{pointsEarned} pts</p>
            <div className="exercise-results-actions">
              <button type="button" className="btn-secondary" onClick={onRetry}>
                Tentar novamente
              </button>
              <button type="button" className="btn-primary" onClick={() => onNavigate(moduleHubHash(moduleId))}>
                Voltar aos módulos
              </button>
            </div>
          </div>
        </div>
        {mascotToast}
      </div>
    )
  }

  return (
    <div className="exercise-session-page">
      <div className="exercise-session-shell">
        <div className="exercise-session-header">
          <div className="exercise-progress-track" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={exercises.length}>
            <div
              className="exercise-progress-fill"
              style={{ width: `${(index / exercises.length) * 100}%` }}
            />
          </div>
          <span className="exercise-session-counter">
            {index + 1} / {exercises.length}
          </span>
        </div>

        <div className="exercise-session-card">
          <ExerciseRenderer key={currentExercise.id} exercise={currentExercise} onAnswer={handleAnswer} disabled={feedback !== null} />
        </div>

        {feedback && (
          <div className={`exercise-feedback ${feedback.correct ? 'is-correct' : 'is-incorrect'}`}>
            <p className="exercise-feedback-title">{feedback.correct ? 'Correto!' : 'Não foi dessa vez.'}</p>
            {!feedback.correct && (
              <p className="exercise-feedback-hint">
                <span className="exercise-feedback-hint-icon" aria-hidden="true">
                  💡
                </span>
                {pickHint(exerciseSet.difficulty, currentExercise.id)}
              </p>
            )}
            {feedback.explanation && <p className="exercise-feedback-explanation">{feedback.explanation}</p>}
            <button type="button" className="btn-primary" onClick={handleContinue}>
              Continuar
            </button>
          </div>
        )}
      </div>
      {mascotToast}
    </div>
  )
}

export default ExerciseSessionPage
