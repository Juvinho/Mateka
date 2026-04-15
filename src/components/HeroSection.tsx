import { useEffect, useRef, useState } from 'react'

import MathBackground from './MathBackground'
import TrigCircle from './TrigCircle'

type HeroSectionProps = {
  onNavigate: (hash: string) => void
}

type QuickStat = {
  id: string
  label: string
  value?: number
  suffix?: string
  staticValue?: string
}

const stats: QuickStat[] = [
  { id: 'modules', label: 'modulos', value: 5 },
  { id: 'viz', label: 'visualizacoes', staticValue: '∞' },
  { id: 'ai', label: 'ia adaptativa', staticValue: 'IA' },
  { id: 'free', label: 'gratis', value: 100, suffix: '%' },
]

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const statsRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  useEffect(() => {
    const element = statsRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    let frame = 0
    const duration = 1300
    const start = performance.now()

    const animate = (now: number): void => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3

      const nextValues: Record<string, number> = {}
      for (const item of stats) {
        if (typeof item.value === 'number') {
          nextValues[item.id] = item.value * eased
        }
      }

      setAnimatedValues(nextValues)

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [visible])

  return (
    <section id="hero" className="hero-section reveal" data-reveal>
      <MathBackground />

      <div className="hero-left">
        <span className="hero-badge">
          <span className="hero-badge-dot" /> A NOVA ERA DA MATEMATICA
        </span>

        <h1 className="hero-title">
          <span>Nao decore.</span>
          <span className="gradient">Visualize.</span>
          <svg className="title-wave" viewBox="0 0 440 34" aria-hidden="true">
            <path
              d="M 4 17 C 48 4, 76 30, 120 17 C 164 4, 192 30, 236 17 C 280 4, 308 30, 352 17 C 396 4, 420 30, 436 17"
              fill="none"
              stroke="url(#titleGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="titleGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </h1>

        <p className="hero-description">
          Matematica nao e uma lista de regras — e um universo visual.
          <br />
          Manipule graficos. Ouva funcoes. Sinta o calculo.
        </p>

        <div ref={statsRef} className="hero-quick-stats" aria-live="polite">
          {stats.map((item, index) => {
            const value =
              typeof item.value === 'number'
                ? Math.round(animatedValues[item.id] ?? 0)
                : item.staticValue

            return (
              <div key={item.id} className="hero-stat-item">
                <strong>
                  {value}
                  {item.suffix ?? ''}
                </strong>
                <span>{item.label}</span>
                {index < stats.length - 1 ? <i aria-hidden="true">·</i> : null}
              </div>
            )
          })}
        </div>

        <div className="hero-ctas">
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('#hero')}
            aria-label="Explorar o circulo trigonometrico"
          >
            Explorar Circulo
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onNavigate('#playground')}
            aria-label="Ver demonstracao do playground"
          >
            Ver Demo →
          </button>
        </div>
      </div>

      <div className="hero-right">
        <TrigCircle />
      </div>
    </section>
  )
}

export default HeroSection
