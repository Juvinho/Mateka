import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard'
export type ExerciseStatus = 'completed' | 'pending' | 'locked'

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

  const isLocked = status === 'locked'
  const [isShaking, setIsShaking] = useState(false)
  const shakeTimerRef = useRef<number | null>(null)
  const cardRef   = useRef<HTMLElement>(null)
  const symbolRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (isLocked) {
      if (shakeTimerRef.current) return
      setIsShaking(true)
      shakeTimerRef.current = window.setTimeout(() => {
        setIsShaking(false)
        shakeTimerRef.current = null
      }, 320)
      return
    }
    onClick?.(id)
  }

  const handleMouseEnter = () => {
    if (reducedMotion || isLocked) return
    gsap.to(cardRef.current,   { scale: 1.018, y: -3, duration: 0.2, ease: 'power1.out' })
    gsap.to(symbolRef.current, { rotation: 8,  duration: 0.2, ease: 'power1.out' })
  }

  const handleMouseLeave = () => {
    if (reducedMotion || isLocked) return
    gsap.to(cardRef.current,   { scale: 1, y: 0,     duration: 0.2, ease: 'power1.out' })
    gsap.to(symbolRef.current, { rotation: 0, duration: 0.2, ease: 'power1.out' })
  }

  return (
    <article
      ref={cardRef}
      className={`exercise-card${isLocked ? ' is-locked' : ''}${isShaking ? ' is-shaking' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-disabled={isLocked}
      aria-label={`Exercício: ${title}${isLocked ? ' — Bloqueado' : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <div className="exercise-card-top">
        <div ref={symbolRef} className="exercise-card-symbol" aria-hidden="true">
          {isLocked ? '🔒' : icon}
        </div>
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
            : status === 'locked'
              ? 'Bloqueado'
              : 'Pendente'}
        </span>
      </div>
    </article>
  )
}

export default ExerciseCard
