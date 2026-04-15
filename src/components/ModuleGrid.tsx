import { useEffect, useMemo, useRef, useState } from 'react'

import { useCardTilt } from '../hooks/useCardTilt'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'

type ModuleGridProps = {
  onNavigate: (hash: string) => void
}

type ModuleCard = {
  id: string
  title: string
  icon: string
  accent: 'slate' | 'purple' | 'yellow' | 'cyan' | 'pink'
  description: string
  difficulty: string
  lessonHash: string
}

type ModuleCardItemProps = {
  module: ModuleCard
  delayMs: number
  isFavorite: boolean
  isRevealed: boolean
  onToggleFavorite: (id: string) => void
  onAccessModule: (module: ModuleCard) => void
}

const FAVORITES_KEY = 'mateka:favoritos'
const GLITCH_SYMBOLS = ['∫', '∑', 'π', 'Δ', '∞', '√', '≈', 'λ']

const readFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const moduleCards: ModuleCard[] = [
  {
    id: 'basic-concepts',
    title: 'Conceitos Básicos',
    icon: '∑',
    accent: 'slate',
    description: 'Fundamentos visuais para ganhar base e confiança.',
    difficulty: 'Ensino Médio',
    lessonHash: '#aula-1',
  },
  {
    id: 'pre-calculus',
    title: 'Pré-Cálculo',
    icon: 'f(x)',
    accent: 'purple',
    description: 'Funções, transformações e leitura gráfica rápida.',
    difficulty: 'Ensino Médio',
    lessonHash: '#aula-2',
  },
  {
    id: 'differential',
    title: 'Cálculo Diferencial',
    icon: "f'",
    accent: 'yellow',
    description: 'Variação instantânea com interpretação de inclinação.',
    difficulty: 'Universitário',
    lessonHash: '#derivadas',
  },
  {
    id: 'integral',
    title: 'Cálculo Integral',
    icon: '∫',
    accent: 'cyan',
    description: 'Acúmulo, área e convergência das somas de Riemann.',
    difficulty: 'Universitário',
    lessonHash: '#integrais',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometria',
    icon: 'sin',
    accent: 'pink',
    description: 'Círculo unitário, projeções e fenômenos periódicos.',
    difficulty: 'Ensino Médio',
    lessonHash: '#hero',
  },
]

const pickGlitchSymbol = (): string => {
  const index = Math.floor(Math.random() * GLITCH_SYMBOLS.length)
  return GLITCH_SYMBOLS[index] ?? '∑'
}

const ModuleCardItem = ({
  module,
  delayMs,
  isFavorite,
  isRevealed,
  onToggleFavorite,
  onAccessModule,
}: ModuleCardItemProps) => {
  const { cardRef, glareRef, onMouseLeave: onTiltLeave, onMouseMove } = useCardTilt()
  const [iconText, setIconText] = useState(module.icon)
  const glitchTimeoutRef = useRef<number | null>(null)

  const handleMouseEnter = (): void => {
    if (glitchTimeoutRef.current) {
      window.clearTimeout(glitchTimeoutRef.current)
    }

    setIconText(pickGlitchSymbol())

    glitchTimeoutRef.current = window.setTimeout(() => {
      setIconText(module.icon)
      glitchTimeoutRef.current = null
    }, 300)
  }

  const handleMouseLeave = (): void => {
    onTiltLeave()

    if (!glitchTimeoutRef.current) return

    window.clearTimeout(glitchTimeoutRef.current)
    glitchTimeoutRef.current = null
    setIconText(module.icon)
  }

  useEffect(() => {
    return () => {
      if (!glitchTimeoutRef.current) return
      window.clearTimeout(glitchTimeoutRef.current)
      glitchTimeoutRef.current = null
    }
  }, [])

  return (
    <article
      ref={cardRef}
      key={module.id}
      className={`module-card accent-${module.accent} ${isRevealed ? 'is-revealed' : ''}`}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor
    >
      <div ref={glareRef} className="card-glare" aria-hidden="true" />

      <div className="module-header">
        <span
          className={`module-icon ${isRevealed ? 'is-revealed' : ''}`}
          aria-hidden="true"
          style={{ transitionDelay: `${delayMs + 200}ms` }}
        >
          {iconText}
        </span>
        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          aria-label={
            isFavorite
              ? `Remover ${module.title} dos favoritos`
              : `Adicionar ${module.title} aos favoritos`
          }
          onClick={() => onToggleFavorite(module.id)}
          data-cursor
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <h3>{module.title}</h3>
      <p>{module.description}</p>

      <div className="module-footer">
        <span className="module-difficulty">{module.difficulty}</span>
        <button
          type="button"
          className="module-access-button"
          onClick={() => onAccessModule(module)}
          aria-label={`Acessar ${module.title}`}
          data-cursor
        >
          <span>Acessar</span>
          <span className="module-access-arrow">→</span>
        </button>
      </div>
    </article>
  )
}

const ModuleGrid = ({ onNavigate }: ModuleGridProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())
  const [sectionRevealed, setSectionRevealed] = useState(false)
  const { registerAttempt, completion } = useSpacedRepetition()

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const topModules = moduleCards.slice(0, 3)
  const bottomModules = moduleCards.slice(3)

  useEffect(() => {
    const target = sectionRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setSectionRevealed(true)
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
  }, [])

  const toggleFavorite = (id: string): void => {
    setFavorites((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }

  const accessModule = (module: ModuleCard): void => {
    registerAttempt(module.id, true)
    onNavigate(module.lessonHash)
  }

  return (
    <section ref={sectionRef} id="conteudos" className="module-grid-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">Módulos da plataforma</p>
        <h2>Escolha seu caminho visual em matemática.</h2>
        <p className="module-completion">
          Precisão média no seu progresso: {(completion * 100).toFixed(0)}%
        </p>
      </header>

      <div className="module-grid module-grid-top">
        {topModules.map((module, index) => (
          <ModuleCardItem
            key={module.id}
            module={module}
            delayMs={index * 80}
            isFavorite={favoriteSet.has(module.id)}
            isRevealed={sectionRevealed}
            onToggleFavorite={toggleFavorite}
            onAccessModule={accessModule}
          />
        ))}
      </div>

      <div className="module-grid-bottom-wrap">
        <div className="module-grid module-grid-bottom">
          {bottomModules.map((module, index) => (
            <ModuleCardItem
              key={module.id}
              module={module}
              delayMs={200 + index * 80}
              isFavorite={favoriteSet.has(module.id)}
              isRevealed={sectionRevealed}
              onToggleFavorite={toggleFavorite}
              onAccessModule={accessModule}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModuleGrid
