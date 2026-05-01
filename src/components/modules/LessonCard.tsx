import { useRef, useState } from 'react'

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
  const [isShaking, setIsShaking] = useState(false)
  const shakeTimerRef = useRef<number | null>(null)

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
      className={cardClass}
      onClick={handleClick}
      role="button"
      tabIndex={status === 'locked' ? -1 : 0}
      aria-disabled={status === 'locked'}
      aria-label={`${title} — ${status === 'done' ? 'Concluída' : status === 'in-progress' ? 'Em andamento' : 'Bloqueada'}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <div className={`lesson-card-status-icon is-${status}`} aria-hidden="true">
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
