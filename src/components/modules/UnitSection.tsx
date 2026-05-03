import LessonCard from './LessonCard'
import type { LessonCardData } from './LessonCard'

type UnitSectionProps = {
  unitNumber: number
  title: string
  lessons: LessonCardData[]
  locked?: boolean
  onLessonClick?: (id: string) => void
}

const UnitSection = ({
  unitNumber,
  title,
  lessons,
  locked = false,
  onLessonClick,
}: UnitSectionProps) => {
  return (
    <div role="region" className="unit-section" aria-labelledby={`unit-${unitNumber}-label`} style={{ marginBottom: '32px' }}>
      <div className="unit-section-header">
        <span
          id={`unit-${unitNumber}-label`}
          className={`unit-section-label${locked ? ' is-locked' : ''}`}
        >
          Unidade {unitNumber} — {title}
          {locked ? ' (BLOQUEADO)' : ''}
        </span>
        {locked && <span className="unit-section-lock-icon" aria-hidden="true">🔒</span>}
      </div>

      <div className="unit-section-lessons" style={{ gap: '8px' }}>
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            {...lesson}
            onClick={onLessonClick}
          />
        ))}
      </div>
    </div>
  )
}

export default UnitSection
