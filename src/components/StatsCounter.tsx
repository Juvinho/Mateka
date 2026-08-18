import { useEffect, useRef, useState } from 'react'

type Stat = {
  id: string
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  title: string
  subtitle: string
}

const stats: Stat[] = [
  {
    id: 'students',
    end: 12000,
    prefix: '+',
    title: 'estudantes',
    subtitle: 'na plataforma',
  },
  {
    id: 'rating',
    end: 4.9,
    prefix: '★ ',
    decimals: 1,
    suffix: '/5',
    title: 'avaliação',
    subtitle: 'nota média',
  },
  {
    id: 'time',
    end: 3,
    suffix: 'h/sem',
    title: 'tempo médio',
    subtitle: 'de uso contínuo',
  },
  {
    id: 'approval',
    end: 98,
    suffix: '%',
    title: 'aprovação',
    subtitle: 'em provas',
  },
]

const StatsCounter = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [values, setValues] = useState<Record<string, number>>({})

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView) return

    let frame = 0
    const duration = 1500
    const start = performance.now()

    const animate = (now: number): void => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)

      const next: Record<string, number> = {}
      for (const stat of stats) {
        next[stat.id] = stat.end * eased
      }
      setValues(next)

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [inView])

  const formatValue = (stat: Stat): string => {
    const value = values[stat.id] ?? 0
    const digits = stat.decimals ?? 0
    const numberText = value.toLocaleString('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })

    return `${stat.prefix ?? ''}${numberText}${stat.suffix ?? ''}`
  }

  return (
    <section ref={sectionRef} className="stats-counter-section reveal" data-reveal>
      <div className="stats-counter-grid">
        {stats.map((stat) => (
          <article key={stat.id} className="stats-counter-item" data-reveal>
            <strong>{formatValue(stat)}</strong>
            <span>{stat.title}</span>
            <small>{stat.subtitle}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StatsCounter
