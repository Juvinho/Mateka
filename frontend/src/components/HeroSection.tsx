import { useEffect, useMemo, useRef, useState } from 'react'

import { useGlitchText } from '../hooks/useGlitchText'
import { useMagneticButton } from '../hooks/useMagneticButton'
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
  { id: 'modules', label: 'módulos', value: 5 },
  { id: 'viz', label: 'visualizações', staticValue: '∞' },
  { id: 'ai', label: 'ia adaptativa', staticValue: 'IA' },
  { id: 'free', label: 'grátis', value: 100, suffix: '%' },
]

const typewriterPhrases = [
  'Transformando matemática abstrata em experiência visual.',
  'Do ensino médio ao cálculo universitário.',
  'Interaja. Experimente. Entenda de verdade.',
  'A matemática que você sentia que faltava.',
]

const titleVariants = [
  'Não decore. Visualize.',
  'Não memorize. Descubra.',
  'Não assuste. Explore.',
  'Não trave. Itere.',
  'Não chute. Derive.',
]

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)

  const [visible, setVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [typedText, setTypedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [titleIndex, setTitleIndex] = useState(0)

  const badgeGlitch = useGlitchText('A NOVA ERA DA MATEMÁTICA')
  const titleGlitch = useGlitchText(titleVariants[titleIndex] ?? titleVariants[0])

  const cycleTitle = (): void => {
    setTitleIndex((previous) => (previous + 1) % titleVariants.length)
  }

  const {
    buttonRef: exploreButtonRef,
    textRef: exploreTextRef,
    onMouseMove: onExploreMouseMove,
    onMouseLeave: onExploreMouseLeave,
  } = useMagneticButton()
  const {
    buttonRef: demoButtonRef,
    textRef: demoTextRef,
    onMouseMove: onDemoMouseMove,
    onMouseLeave: onDemoMouseLeave,
  } = useMagneticButton()

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const coarsePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches,
    [],
  )

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

  useEffect(() => {
    const currentPhrase = typewriterPhrases[phraseIndex]
    if (!currentPhrase) return

    if (!isDeleting && typedText === currentPhrase) {
      const pauseTimer = window.setTimeout(() => {
        setIsDeleting(true)
      }, 2200)

      return () => {
        window.clearTimeout(pauseTimer)
      }
    }

    if (isDeleting && typedText.length === 0) {
      const nextPhraseTimer = window.setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((previous) => (previous + 1) % typewriterPhrases.length)
      }, 0)

      return () => {
        window.clearTimeout(nextPhraseTimer)
      }
    }

    const stepDelay = isDeleting ? 25 : 45
    const nextText = isDeleting
      ? currentPhrase.slice(0, typedText.length - 1)
      : currentPhrase.slice(0, typedText.length + 1)

    const stepTimer = window.setTimeout(() => {
      setTypedText(nextText)
    }, stepDelay)

    return () => {
      window.clearTimeout(stepTimer)
    }
  }, [isDeleting, phraseIndex, typedText])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (reducedMotion || coarsePointer) {
      section.style.setProperty('--hero-mx', '0')
      section.style.setProperty('--hero-my', '0')
      return
    }

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0

    const onPointerMove = (event: PointerEvent): void => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const onPointerLeave = (): void => {
      target.x = 0
      target.y = 0
    }

    const animate = (): void => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06

      section.style.setProperty('--hero-mx', current.x.toFixed(4))
      section.style.setProperty('--hero-my', current.y.toFixed(4))

      frame = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [coarsePointer, reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`hero-section reveal ${reducedMotion || coarsePointer ? 'is-parallax-disabled' : ''}`}
      data-reveal
    >
      <div ref={leftRef} className="hero-left">
        <span className="hero-badge">
          <span className="hero-badge-dot" />
          <span className={`hero-badge-text ${badgeGlitch.glitchClass}`}>
            {badgeGlitch.displayText}
          </span>
        </span>

        <h1
          className="hero-title is-clickable"
          onClick={cycleTitle}
          title="Clique para embaralhar"
          data-cursor
          data-no-burst
        >
          <span className={`hero-title-glitch ${titleGlitch.glitchClass}`}>
            {titleGlitch.displayText}
          </span>
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

        <p className="hero-description hero-typewriter" aria-live="polite">
          <span>{typedText}</span>
          <span className="typewriter-cursor">|</span>
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
            ref={exploreButtonRef}
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('#hero')}
            onMouseMove={onExploreMouseMove}
            onMouseLeave={onExploreMouseLeave}
            aria-label="Explorar o círculo trigonométrico"
            data-cursor
          >
            <span ref={exploreTextRef}>Explorar Círculo</span>
          </button>
          <button
            ref={demoButtonRef}
            type="button"
            className="btn-secondary"
            onClick={() => onNavigate('#playground')}
            onMouseMove={onDemoMouseMove}
            onMouseLeave={onDemoMouseLeave}
            aria-label="Ver demonstração do playground"
            data-cursor
          >
            <span ref={demoTextRef}>Ver Demo →</span>
          </button>
        </div>
      </div>

      <div ref={rightRef} className="hero-right">
        <TrigCircle />
      </div>
    </section>
  )
}

export default HeroSection
