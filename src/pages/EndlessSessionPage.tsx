import { useCallback, useRef, useState } from 'react'
import ExerciseRenderer from '../components/exercise/ExerciseRenderer'
import type { Exercise } from '../data/exerciseTypes'
import { ENDLESS_BANK, shuffle, type Difficulty } from '../data/matrizes/endlessBank'
import { gradeExercise, type ExerciseAnswer } from '../lib/grading'
import { useMatrizesProgress } from '../state/useMatrizesProgress'

type Props = {
  difficulty: Difficulty
  onNavigate: (hash: string) => void
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const EndlessSessionPage = ({ difficulty, onNavigate }: Props) => {
  const { recordEndlessAnswer } = useMatrizesProgress()
  const bank = ENDLESS_BANK[difficulty]

  const [status, setStatus] = useState<'intro' | 'active'>('intro')
  const queueRef = useRef<Exercise[]>(shuffle(bank))
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null)

  if (index >= queueRef.current.length) {
    queueRef.current = [...queueRef.current, ...shuffle(bank)]
  }
  const currentExercise = queueRef.current[index]

  const handleAnswer = useCallback(
    (answer: ExerciseAnswer) => {
      const correct = gradeExercise(currentExercise, answer)
      setAnswered((a) => a + 1)
      if (correct) setCorrectCount((c) => c + 1)
      recordEndlessAnswer(difficulty, correct)
      setFeedback({ correct, explanation: currentExercise.explanation })
    },
    [currentExercise, difficulty, recordEndlessAnswer],
  )

  const handleContinue = useCallback(() => {
    setFeedback(null)
    setIndex((i) => i + 1)
  }, [])

  const accuracyPct = answered > 0 ? Math.round((correctCount / answered) * 100) : 0

  if (status === 'intro') {
    return (
      <div className="exercise-session-page">
        <div className="exercise-session-shell">
          <div className="exercise-session-card exercise-intro-card">
            <span className="exercise-endless-pill">MODO ENDLESS</span>
            <span className={`exercise-difficulty-badge ${difficulty}`}>{DIFFICULTY_LABEL[difficulty]}</span>
            <h1>Prática sem limite</h1>
            <p>
              Questões {DIFFICULTY_LABEL[difficulty].toLowerCase()}s embaralhadas de todo o módulo, sem fim — pratique
              o quanto quiser e encerre quando decidir.
            </p>
            <p className="exercise-results-points">{bank.length} questões no banco · +5 pts por acerto</p>
            <button type="button" className="btn-primary" onClick={() => setStatus('active')}>
              Começar
            </button>
            <div className="exercise-results-actions">
              <button type="button" className="btn-secondary" onClick={() => onNavigate('#modulos')}>
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
        <div className="exercise-endless-header">
          <div className="exercise-endless-title">
            <span className="exercise-endless-pill">MODO ENDLESS</span>
            <span className={`exercise-difficulty-badge ${difficulty}`}>{DIFFICULTY_LABEL[difficulty]}</span>
          </div>
          <button type="button" className="btn-secondary exercise-endless-stop" onClick={() => onNavigate('#modulos')}>
            Encerrar sessão
          </button>
        </div>

        <div className="exercise-endless-stats">
          <span>{answered} respondidas</span>
          <span>{correctCount} corretas</span>
          <span>{accuracyPct}% de acerto</span>
          <span>+{correctCount * 5} pts nesta sessão</span>
        </div>

        <div className="exercise-session-card">
          <ExerciseRenderer key={`${currentExercise.id}-${index}`} exercise={currentExercise} onAnswer={handleAnswer} disabled={feedback !== null} />
        </div>

        {feedback && (
          <div className={`exercise-feedback ${feedback.correct ? 'is-correct' : 'is-incorrect'}`}>
            <p className="exercise-feedback-title">{feedback.correct ? 'Correto!' : 'Não foi dessa vez.'}</p>
            {feedback.explanation && <p className="exercise-feedback-explanation">{feedback.explanation}</p>}
            <button type="button" className="btn-primary" onClick={handleContinue}>
              Próxima questão →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EndlessSessionPage
