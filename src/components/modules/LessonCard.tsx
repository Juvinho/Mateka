import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

export type LessonStatus = 'done' | 'in-progress' | 'locked'
export type LessonTag = 'Vídeo' | 'Interativo' | 'Exercício'

export type LessonCardData = {
  id: string
  title: string
  description: string
  tags: LessonTag[]
  status: LessonStatus
  accuracy: number | null
  duration: number
}

type LessonCardProps = LessonCardData & {
  onClick?: (id: string) => void
}

const STATUS_ICONS: Record<LessonStatus, string> = {
  done: '✓',
  'in-progress': '▶',
  locked: '🔒',
}

const TAG_CLASS: Record<LessonTag, string> = {
  'Vídeo': 'tag-video',
  'Interativo': 'tag-interativo',
  'Exercício': 'tag-exercicio',
}

const LessonCard = ({
  id,
  title,
  description,
  tags,
  status,
  accuracy,
  duration,
  onClick,
}: LessonCardProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [isShaking, setIsShaking] = useState(false)
  const shakeTimerRef = useRef<number | null>(null)
  const cardRef       = useRef<HTMLDivElement>(null)
  const iconRef       = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (status === 'locked') {
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
    if (reducedMotion || status === 'locked') return
    gsap.to(cardRef.current, { scale: 1.015, duration: 0.2, ease: 'power1.out' })
    gsap.to(iconRef.current, { rotation: 5, duration: 0.2, ease: 'power1.out' })
  }

  const handleMouseLeave = () => {
    if (reducedMotion || status === 'locked') return
    gsap.to(cardRef.current, { scale: 1, duration: 0.2, ease: 'power1.out' })
    gsap.to(iconRef.current, { rotation: 0, duration: 0.2, ease: 'power1.out' })
  }

  const cardClass = [
    'lesson-card',
    status === 'in-progress' ? 'is-in-progress' : '',
    status === 'locked' ? 'is-locked' : '',
    isShaking ? 'is-shaking' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={cardRef}
      className={cardClass}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={status === 'locked' ? -1 : 0}
      aria-disabled={status === 'locked'}
      aria-label={`${title} — ${status === 'done' ? 'Concluída' : status === 'in-progress' ? 'Em andamento' : 'Bloqueada'}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <div ref={iconRef} className={`lesson-card-status-icon is-${status}`} aria-hidden="true">
        {STATUS_ICONS[status]}
      </div>

      <div className="lesson-card-body">
        <p className="lesson-card-title">{title}</p>
        <p className="lesson-card-desc">{description}</p>
        <div className="lesson-card-tags">
          {tags.map((tag) => (
            <span key={tag} className={`lesson-tag ${TAG_CLASS[tag]}`}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="lesson-card-meta">
        {accuracy !== null && (
          <span className="lesson-card-accuracy">{accuracy}%</span>
        )}
        <span className="lesson-card-duration">{duration} min</span>
      </div>
    </div>
  )
}

export default LessonCard
