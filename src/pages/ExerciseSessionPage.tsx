import { useCallback, useEffect, useState } from 'react'
import ExerciseRenderer from '../components/exercise/ExerciseRenderer'
import type { ExerciseSet } from '../data/exerciseTypes'
import { gradeExercise, type ExerciseAnswer } from '../lib/grading'
import { useMatrizesProgress } from '../state/useMatrizesProgress'

type Props = {
  exerciseSet: ExerciseSet
  onNavigate: (hash: string) => void
}

const DIFFICULTY_LABEL: Record<ExerciseSet['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const ExerciseSessionPage = ({ exerciseSet, onNavigate }: Props) => {
  const [attempt, setAttempt] = useState(0)

  return (
    <ExerciseSessionInner
      key={`${exerciseSet.id}-${attempt}`}
      exerciseSet={exerciseSet}
      onNavigate={onNavigate}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  )
}

type InnerProps = Props & { onRetry: () => void }

type SessionStatus = 'intro' | 'active' | 'results'

const ExerciseSessionInner = ({ exerciseSet, onNavigate, onRetry }: InnerProps) => {
  const { recordExerciseResult } = useMatrizesProgress()
  const [status, setStatus] = useState<SessionStatus>('intro')
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null)
  const [resultSaved, setResultSaved] = useState(false)

  const exercises = exerciseSet.exercises
  const currentExercise = exercises[index]

  useEffect(() => {
    if (status !== 'results' || resultSaved) return
    const accuracy = exercises.length > 0 ? correctCount / exercises.length : 0
    recordExerciseResult(exerciseSet.id, accuracy, exerciseSet.points)
    setResultSaved(true)
  }, [status, resultSaved, correctCount, exercises.length, exerciseSet.id, exerciseSet.points, recordExerciseResult])

  const handleAnswer = useCallback(
    (answer: ExerciseAnswer) => {
      const correct = gradeExercise(currentExercise, answer)
      if (correct) setCorrectCount((c) => c + 1)
      setFeedback({ correct, explanation: currentExercise.explanation })
    },
    [currentExercise],
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
              <button type="button" className="btn-primary" onClick={() => onNavigate('#modulos')}>
                Voltar aos módulos
              </button>
            </div>
          </div>
        </div>
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
            {feedback.explanation && <p className="exercise-feedback-explanation">{feedback.explanation}</p>}
            <button type="button" className="btn-primary" onClick={handleContinue}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExerciseSessionPage
