import { useMemo, useState } from 'react'

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

const FAVORITES_KEY = 'mateka:favoritos'

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
    title: 'Conceitos Basicos',
    icon: '∑',
    accent: 'slate',
    description: 'Fundamentos visuais para ganhar base e confianca.',
    difficulty: 'Ensino Medio',
    lessonHash: '#aula-1',
  },
  {
    id: 'pre-calculus',
    title: 'Pre-Calculo',
    icon: 'f(x)',
    accent: 'purple',
    description: 'Funcoes, transformacoes e leitura grafica rapida.',
    difficulty: 'Ensino Medio',
    lessonHash: '#aula-2',
  },
  {
    id: 'differential',
    title: 'Calculo Diferencial',
    icon: "f'",
    accent: 'yellow',
    description: 'Variacao instantanea com interpretacao de inclinacao.',
    difficulty: 'Universitario',
    lessonHash: '#derivadas',
  },
  {
    id: 'integral',
    title: 'Calculo Integral',
    icon: '∫',
    accent: 'cyan',
    description: 'Acumulo, area e convergencia das somas de Riemann.',
    difficulty: 'Universitario',
    lessonHash: '#integrais',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometria',
    icon: 'sin',
    accent: 'pink',
    description: 'Circulo unitario, projecoes e fenomenos periodicos.',
    difficulty: 'Ensino Medio',
    lessonHash: '#hero',
  },
]

const ModuleGrid = ({ onNavigate }: ModuleGridProps) => {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())
  const { registerAttempt, completion } = useSpacedRepetition()

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const topModules = moduleCards.slice(0, 3)
  const bottomModules = moduleCards.slice(3)

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

  const renderModuleCard = (module: ModuleCard, index: number) => {
    const isFavorite = favoriteSet.has(module.id)

    return (
      <article
        key={module.id}
        className={`module-card accent-${module.accent}`}
        data-reveal
        data-stagger={index}
      >
        <div className="module-header">
          <span className="module-icon" aria-hidden="true">
            {module.icon}
          </span>
          <button
            type="button"
            className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            aria-label={
              isFavorite
                ? `Remover ${module.title} dos favoritos`
                : `Adicionar ${module.title} aos favoritos`
            }
            onClick={() => toggleFavorite(module.id)}
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
            onClick={() => accessModule(module)}
            aria-label={`Acessar ${module.title}`}
          >
            Acessar →
          </button>
        </div>
      </article>
    )
  }

  return (
    <section id="conteudos" className="module-grid-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">Modulos da plataforma</p>
        <h2>Escolha seu caminho visual em matematica.</h2>
        <p className="module-completion">Precisao media no seu progresso: {(completion * 100).toFixed(0)}%</p>
      </header>

      <div className="module-grid module-grid-top">
        {topModules.map((module, index) => renderModuleCard(module, index))}
      </div>

      <div className="module-grid-bottom-wrap">
        <div className="module-grid module-grid-bottom">
          {bottomModules.map((module, index) => renderModuleCard(module, index + topModules.length))}
        </div>
      </div>
    </section>
  )
}

export default ModuleGrid
