import { useMemo, useRef } from 'react'
import gsap from 'gsap'

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard'
export type ExerciseStatus = 'completed' | 'pending'

export type ExerciseCardData = {
  id: string
  icon: string
  difficulty: ExerciseDifficulty
  title: string
  description: string
  duration: number
  questions: number
  points: number
  status: ExerciseStatus
  accuracy?: number
}

type ExerciseCardProps = ExerciseCardData & {
  onClick?: (id: string) => void
}

const DIFFICULTY_LABEL: Record<ExerciseDifficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const ExerciseCard = ({
  id,
  icon,
  difficulty,
  title,
  description,
  duration,
  questions,
  points,
  status,
  accuracy,
  onClick,
}: ExerciseCardProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const cardRef   = useRef<HTMLElement>(null)
  const symbolRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (reducedMotion) return
    gsap.to(cardRef.current,   { scale: 1.018, y: -3, duration: 0.2, ease: 'power1.out' })
    gsap.to(symbolRef.current, { rotation: 8,  duration: 0.2, ease: 'power1.out' })
  }

  const handleMouseLeave = () => {
    if (reducedMotion) return
    gsap.to(cardRef.current,   { scale: 1, y: 0,     duration: 0.2, ease: 'power1.out' })
    gsap.to(symbolRef.current, { rotation: 0, duration: 0.2, ease: 'power1.out' })
  }

  return (
    <article
      ref={cardRef}
      className="exercise-card"
      onClick={() => onClick?.(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Exercício: ${title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(id) }}
    >
      <div className="exercise-card-top">
        <div ref={symbolRef} className="exercise-card-symbol" aria-hidden="true">{icon}</div>
        <span className={`exercise-difficulty-badge ${difficulty}`}>
          {DIFFICULTY_LABEL[difficulty]}
        </span>
      </div>

      <p className="exercise-card-title">{title}</p>
      <p className="exercise-card-desc">{description}</p>

      <div className="exercise-card-stats">
        <span className="exercise-stat">⏱ {duration} min</span>
        <span className="exercise-stat">📝 {questions} questões</span>
      </div>

      <div className="exercise-card-footer">
        <span className="exercise-card-points">+{points} pts</span>
        <span className={`exercise-card-status ${status}`}>
          {status === 'completed'
            ? `✓ Concluído${accuracy !== undefined ? ` — ${accuracy}%` : ''}`
            : 'Pendente'}
        </span>
      </div>
    </article>
  )
}

export default ExerciseCard
