import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { useCardTilt } from '../hooks/useCardTilt'
import { useSpringReveal } from '../hooks/useSpringReveal'

type WhyCardProps = {
  id: 'game-dev' | 'audio' | 'engineering'
  tone: 'cyan' | 'pink' | 'purple'
  delayMs: number
  isVisible: boolean
  title: string
  description: string
  onHoverChange: (id: WhyCardProps['id'], hovered: boolean) => void
  children: ReactNode
}

const GameDevIcon = ({ hovered, reducedMotion }: { hovered: boolean; reducedMotion: boolean }) => {
  const [angle, setAngle] = useState(0)
  const boostUntilRef = useRef(0)

  useEffect(() => {
    if (!hovered) return
    boostUntilRef.current = performance.now() + 1000
  }, [hovered])

  useEffect(() => {
    if (reducedMotion) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number): void => {
      const dt = (now - last) / 16.667
      last = now

      const boosted = now < boostUntilRef.current ? 3 : 1
      setAngle((previous) => previous + 0.02 * boosted * dt)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  const x = 70 + Math.cos(angle) * 34
  const y = 60 - Math.sin(angle) * 34
  const degrees = Math.round((((angle * 180) / Math.PI) % 360 + 360) % 360)

  return (
    <svg viewBox="0 0 140 120" role="img" aria-label="Vetor 2D interativo">
      <circle cx="70" cy="60" r="36" fill="none" stroke="rgba(34,211,238,0.2)" />
      <line x1="70" y1="60" x2={x} y2={y} stroke="#22d3ee" strokeWidth="3" />
      <polygon points={`${x},${y} ${x - 8},${y + 4} ${x - 4},${y - 8}`} fill="#22d3ee" />
      <circle cx="70" cy="60" r="3" fill="rgba(34,211,238,0.8)" />
      <text x="10" y="18" className="why-viz-label">
        θ = {degrees}°
      </text>
    </svg>
  )
}

const AudioIcon = ({ hovered, reducedMotion }: { hovered: boolean; reducedMotion: boolean }) => {
  const [frequency, setFrequency] = useState(220)
  const [phase, setPhase] = useState(0)

  const frequencyRef = useRef(220)
  const phaseRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      setFrequency(220)
      setPhase(0)
      return
    }

    let frame = 0

    const tick = (): void => {
      const target = hovered ? 880 : 220
      frequencyRef.current += (target - frequencyRef.current) * 0.03
      phaseRef.current += 0.03 * (frequencyRef.current / 220)

      setFrequency(frequencyRef.current)
      setPhase(phaseRef.current)

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [hovered, reducedMotion])

  const cycles = 1.3 + ((frequency - 220) / 660) * 3.4
  const amplitude = 12 + Math.sin(phase * 0.4) * 6

  let path = ''
  for (let x = 8; x <= 132; x += 2) {
    const normalized = (x - 8) / 124
    const y = 60 - Math.sin(normalized * Math.PI * 2 * cycles + phase) * amplitude
    path += x === 8 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }

  return (
    <svg viewBox="0 0 140 120" role="img" aria-label="Onda senoidal com frequência interativa">
      <path d={path} fill="none" stroke="#f472b6" strokeWidth="2.5" />
      <text x="10" y="18" className="why-viz-label">
        f = {Math.round(frequency)} Hz
      </text>
    </svg>
  )
}

const EngineeringIcon = ({ hovered, reducedMotion }: { hovered: boolean; reducedMotion: boolean }) => {
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setPulse(0)
      return
    }

    let frame = 0

    const tick = (now: number): void => {
      setPulse(now / 1000)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  const intensity = hovered ? 1 : 0.45
  const compressionShift = Math.sin(pulse * 3.2) * 5 * intensity
  const tensionShift = Math.cos(pulse * 2.6) * 4 * intensity

  return (
    <svg viewBox="0 0 140 120" role="img" aria-label="Arco de ponte com vetores de força">
      <path
        d="M 12 84 Q 70 14 128 84"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3"
      />

      <line x1="44" y1="54" x2="44" y2={70 + compressionShift} stroke="#22c55e" strokeWidth="2.3" />
      <polygon points={`40,${66 + compressionShift} 48,${66 + compressionShift} 44,${74 + compressionShift}`} fill="#22c55e" />

      <line x1="70" y1="36" x2="70" y2={56 + compressionShift} stroke="#22c55e" strokeWidth="2.3" />
      <polygon points={`66,${52 + compressionShift} 74,${52 + compressionShift} 70,${60 + compressionShift}`} fill="#22c55e" />

      <line x1="96" y1="54" x2="96" y2={70 + compressionShift} stroke="#22c55e" strokeWidth="2.3" />
      <polygon points={`92,${66 + compressionShift} 100,${66 + compressionShift} 96,${74 + compressionShift}`} fill="#22c55e" />

      <line x1="30" y1="84" x2={18 - tensionShift} y2="84" stroke="#ef4444" strokeWidth="2" />
      <polygon points={`${22 - tensionShift},80 ${22 - tensionShift},88 ${14 - tensionShift},84`} fill="#ef4444" />

      <line x1="110" y1="84" x2={122 + tensionShift} y2="84" stroke="#ef4444" strokeWidth="2" />
      <polygon points={`${118 + tensionShift},80 ${118 + tensionShift},88 ${126 + tensionShift},84`} fill="#ef4444" />
    </svg>
  )
}

const WhyCard = ({
  id,
  tone,
  delayMs,
  isVisible,
  title,
  description,
  onHoverChange,
  children,
}: WhyCardProps) => {
  const { cardRef, glareRef, onMouseLeave, onMouseMove } = useCardTilt()

  return (
    <article
      ref={cardRef}
      className={`why-card ${tone} ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        onMouseLeave()
        onHoverChange(id, false)
      }}
      onMouseEnter={() => onHoverChange(id, true)}
      data-cursor
    >
      <div ref={glareRef} className="card-glare" aria-hidden="true" />
      <span className="top-border" />
      {children}
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

const WhyItMatters = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const sectionRef = useRef<HTMLElement | null>(null)
  const [cardsVisible, setCardsVisible] = useState(reducedMotion)
  const [hoverState, setHoverState] = useState({
    'game-dev': false,
    audio: false,
    engineering: false,
  })

  useSpringReveal({
    rootRef: sectionRef,
    selector: '.why-card',
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
          setCardsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.3,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [reducedMotion])

  const handleHoverChange = (id: 'game-dev' | 'audio' | 'engineering', hovered: boolean): void => {
    setHoverState((previous) => ({ ...previous, [id]: hovered }))
  }

  return (
    <section
      ref={sectionRef}
      id="why-it-matters"
      className="why-it-matters-section reveal"
      data-reveal
    >
      <header className="section-header">
        <p className="section-kicker">Aplicações reais</p>
        <h2>Por que isso importa fora da sala de aula?</h2>
      </header>

      <div className="why-cards-grid">
        <WhyCard
          id="game-dev"
          tone="cyan"
          delayMs={40}
          isVisible={cardsVisible}
          title="Game Dev"
          description="Vetores, ângulos e trigonometria controlam câmera, iluminação e colisão em qualquer motor de jogo."
          onHoverChange={handleHoverChange}
        >
          <GameDevIcon hovered={hoverState['game-dev']} reducedMotion={reducedMotion} />
        </WhyCard>

        <WhyCard
          id="audio"
          tone="pink"
          delayMs={140}
          isVisible={cardsVisible}
          title="Síntese de Áudio"
          description="Frequência e amplitude deixam de ser teoria: você manipula onda, harmônica e timbre em tempo real."
          onHoverChange={handleHoverChange}
        >
          <AudioIcon hovered={hoverState.audio} reducedMotion={reducedMotion} />
        </WhyCard>

        <WhyCard
          id="engineering"
          tone="purple"
          delayMs={240}
          isVisible={cardsVisible}
          title="Engenharia"
          description="Curvas e distribuição de carga explicam pontes, estruturas e materiais de forma intuitiva."
          onHoverChange={handleHoverChange}
        >
          <EngineeringIcon hovered={hoverState.engineering} reducedMotion={reducedMotion} />
        </WhyCard>
      </div>
    </section>
  )
}

export default WhyItMatters
