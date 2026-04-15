import { useEffect, useMemo, useRef, useState } from 'react'

import { useCardTilt } from '../hooks/useCardTilt'
import { useSpringReveal } from '../hooks/useSpringReveal'

type StatItem = {
  label: string
  value: number
  suffix: string
  note: string
  iconPath: string
}

type StatCardProps = {
  item: StatItem
  displayValue: string
  isVisible: boolean
  isPulsing: boolean
}

const stats: StatItem[] = [
  {
    label: 'Exercícios interativos',
    value: 5200,
    suffix: '+',
    note: 'curtos e visuais',
    iconPath: 'M 8 42 L 22 28 L 34 34 L 50 16',
  },
  {
    label: 'Alunos ativos',
    value: 18000,
    suffix: '+',
    note: 'aprendendo com exploração',
    iconPath: 'M 10 42 C 18 24, 28 24, 36 42 C 42 26, 52 26, 58 42',
  },
  {
    label: 'Tempo médio para entender',
    value: 5,
    suffix: ' min',
    note: 'do conceito ao clique',
    iconPath: 'M 34 10 A 24 24 0 1 1 33.9 10 M 34 16 L 34 34 L 46 38',
  },
  {
    label: 'Taxa de acerto após revisão',
    value: 92,
    suffix: '%',
    note: 'com repetição inteligente',
    iconPath: 'M 8 34 L 24 48 L 52 16',
  },
]

const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3)

const formatDisplay = (value: number, suffix: string): string =>
  `${value.toLocaleString('pt-BR')}${suffix}`

const randomDisplay = (target: number, suffix: string): string => {
  const randomValue = Math.max(1, Math.floor(Math.random() * (target + 1)))
  return formatDisplay(randomValue, suffix)
}

const StatCard = ({ item, displayValue, isVisible, isPulsing }: StatCardProps) => {
  const { cardRef, glareRef, onMouseMove, onMouseLeave } = useCardTilt()

  return (
    <article
      ref={cardRef}
      className={`stats-bar-item ${isVisible ? 'is-visible' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor
    >
      <div ref={glareRef} className="card-glare" aria-hidden="true" />

      <svg className="stats-bar-icon" viewBox="0 0 68 56" aria-hidden="true">
        <path className="stats-bar-icon-path" d={item.iconPath} fill="none" />
      </svg>

      <strong className={isPulsing ? 'is-pulsing' : ''}>{displayValue}</strong>
      <span>{item.label}</span>
      <small>{item.note}</small>
    </article>
  )
}

const StatsBar = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const sectionRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const pulseTimeoutRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)

  const [isVisible, setIsVisible] = useState(reducedMotion)
  const [isPulsing, setIsPulsing] = useState(false)
  const [displayValues, setDisplayValues] = useState<string[]>(() =>
    reducedMotion ? stats.map((item) => formatDisplay(item.value, item.suffix)) : stats.map(() => '0'),
  )

  useSpringReveal({
    rootRef: sectionRef,
    selector: '.stats-bar-shell, .stats-bar-item',
    staggerMs: 60,
    disabled: reducedMotion,
  })

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

    const duration = 1100
    const start = performance.now()

    const tick = (now: number): void => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      setDisplayValues(
        stats.map((item, index) => {
          const offset = Math.min(index * 0.08, 0.3)
          const normalized = Math.max(0, Math.min((progress - offset) / (1 - offset), 1))

          if (normalized < 0.7) {
            return randomDisplay(item.value, item.suffix)
          }

          const settle = easeOutCubic((normalized - 0.7) / 0.3)
          const settledValue = Math.round(item.value * settle)
          return formatDisplay(settledValue, item.suffix)
        }),
      )

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick)
        return
      }

      setDisplayValues(stats.map((item) => formatDisplay(item.value, item.suffix)))
      setIsPulsing(true)

      pulseTimeoutRef.current = window.setTimeout(() => {
        setIsPulsing(false)
        pulseTimeoutRef.current = null
      }, 300)
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      if (!pulseTimeoutRef.current) return
      window.clearTimeout(pulseTimeoutRef.current)
      pulseTimeoutRef.current = null
    }
  }, [isVisible, reducedMotion])

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      if (!pulseTimeoutRef.current) return
      window.clearTimeout(pulseTimeoutRef.current)
      pulseTimeoutRef.current = null
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`stats-bar-section ${isVisible ? 'is-visible' : ''}`}
      aria-label="Resumo rápido da plataforma"
    >
      <div className="stats-bar-shell">
        <div className="stats-bar-grid">
          {stats.map((item, index) => (
            <StatCard
              key={item.label}
              item={item}
              displayValue={displayValues[index] ?? formatDisplay(item.value, item.suffix)}
              isVisible={isVisible}
              isPulsing={isPulsing}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
