import { useEffect, useMemo, useRef, useState } from 'react'

type StatItem = {
  label: string
  value: number
  suffix: string
  note: string
}

const stats: StatItem[] = [
  {
    label: 'Exercicios interativos',
    value: 5200,
    suffix: '+',
    note: 'curtos e visuais',
  },
  {
    label: 'Alunos ativos',
    value: 18000,
    suffix: '+',
    note: 'aprendendo com exploracao',
  },
  {
    label: 'Tempo medio para entender',
    value: 5,
    suffix: ' min',
    note: 'do conceito ao clique',
  },
  {
    label: 'Taxa de acerto apos revisao',
    value: 92,
    suffix: '%',
    note: 'com repeticao inteligente',
  },
]

const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3)

const StatsBar = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const sectionRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)
  const [isVisible, setIsVisible] = useState(reducedMotion)
  const [counts, setCounts] = useState<number[]>(() =>
    reducedMotion ? stats.map((item) => item.value) : stats.map(() => 0),
  )

  useEffect(() => {
    if (reducedMotion) return

    const target = sectionRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!isVisible || reducedMotion || hasStartedRef.current) return

    hasStartedRef.current = true

    const duration = 980
    const start = performance.now()

    const tick = (now: number): void => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      setCounts(
        stats.map((item, index) => {
          const offset = Math.min(index * 0.08, 0.28)
          const normalized = Math.max(0, Math.min((progress - offset) / (1 - offset), 1))
          return Math.round(item.value * easeOutCubic(normalized))
        }),
      )

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (!frameRef.current) return
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [isVisible, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className={`stats-bar-section ${isVisible ? 'is-visible' : ''}`}
      aria-label="Resumo rapido da plataforma"
    >
      <div className="stats-bar-shell">
        <div className="stats-bar-grid">
          {stats.map((item, index) => (
            <article key={item.label} className="stats-bar-item">
              <strong>
                {counts[index].toLocaleString('pt-BR')}
                {item.suffix}
              </strong>
              <span>{item.label}</span>
              <small>{item.note}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
