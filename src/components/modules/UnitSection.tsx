import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

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
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reducedMotion) return

    const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null)
    gsap.set(items, { opacity: 0, y: 20 })

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLDivElement
          const index = items.indexOf(el)
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: index * 0.06,
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )

    items.forEach((el) => io.observe(el))

    return () => { io.disconnect() }
  }, [reducedMotion])

  return (
    <div
      role="region"
      className="unit-section"
      aria-labelledby={`unit-${unitNumber}-label`}
      style={{ marginBottom: '32px' }}
    >
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
        {lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            ref={(el) => { itemRefs.current[i] = el }}
            style={{ opacity: reducedMotion ? undefined : 0 }}
          >
            <LessonCard {...lesson} onClick={onLessonClick} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UnitSection
