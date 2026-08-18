import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

const DAY_NAMES = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

type StreakSectionProps = {
  streak: number
  days: boolean[]
  todayIndex?: number
}

const getMotivationalMessage = (streak: number): string => {
  if (streak >= 14) return 'Você está em chamas! 🔥🔥'
  if (streak >= 7)  return 'Meta da semana concluída! 🎉'
  if (streak >= 4)  return 'Quase uma semana! Não pare agora.'
  return 'Bom começo! Continue assim.'
}

const StreakSection = ({ streak, days, todayIndex }: StreakSectionProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const itemRefs      = useRef<(HTMLDivElement | null)[]>([])
  const todayCircleRef = useRef<HTMLDivElement | null>(null)
  const message        = getMotivationalMessage(streak)
  const normalizedDays = days.slice(0, 7)

  useEffect(() => {
    if (reducedMotion) return

    const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null)
    gsap.set(items, { scale: 0, opacity: 0 })

    const tl = gsap.timeline()
    tl.to(items, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(1.4)',
      stagger: 0.08,
    })

    return () => { tl.kill() }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !todayCircleRef.current) return

    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(todayCircleRef.current, {
      scale: 1.08,
      duration: 0.8,
      ease: 'power1.inOut',
    })

    return () => { tl.kill() }
  }, [reducedMotion, todayIndex])

  return (
    <div className="streak-section" aria-label="Sequência semanal de estudo">
      <div className="streak-counter">
        <span className="streak-number" aria-label={`${streak} dias seguidos`}>
          🔥 {streak}
        </span>
        <span className="streak-label">Dias Seguidos</span>
      </div>

      <div className="streak-days-row" role="list" aria-label="Dias da semana">
        {DAY_NAMES.map((name, i) => {
          const isDone  = normalizedDays[i] === true
          const isToday = i === todayIndex

          const circleClass = [
            'streak-day-circle',
            isDone  ? 'is-done'  : '',
            isToday ? 'is-today' : '',
            !isDone && !isToday ? 'is-empty' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={name}
              className="streak-day-item"
              role="listitem"
              aria-label={`${name}: ${isDone ? 'concluído' : isToday ? 'hoje' : 'pendente'}`}
              ref={(el) => { itemRefs.current[i] = el }}
              style={{ animation: 'none', opacity: reducedMotion ? 1 : 0 }}
            >
              <div
                className={circleClass}
                aria-hidden="true"
                ref={isToday ? todayCircleRef : undefined}
              >
                {isDone ? '✓' : isToday ? '🔥' : ''}
              </div>
              <span className="streak-day-name">{name}</span>
            </div>
          )
        })}
      </div>

      <p className="streak-message">{message}</p>
    </div>
  )
}

export default StreakSection
