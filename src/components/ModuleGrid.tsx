import { useEffect, useMemo, useRef, useState } from 'react'

import { useCardTilt } from '../hooks/useCardTilt'
import { useSpringReveal } from '../hooks/useSpringReveal'
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
  reducedMotion: boolean
  onToggleFavorite: (id: string) => void
  onAccessModule: (module: ModuleCard) => void
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

const ModulePreviewCanvas = ({ moduleId, active }: { moduleId: string; active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const logicalSize = 80
    canvas.width = Math.floor(logicalSize * dpr)
    canvas.height = Math.floor(logicalSize * dpr)
    canvas.style.width = `${logicalSize}px`
    canvas.style.height = `${logicalSize}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    let frame = 0

    const drawBasicConcepts = (t: number): void => {
      const bars = 8
      for (let i = 0; i < bars; i += 1) {
        const phase = t * 0.003 + i * 0.7
        const h = 10 + (Math.sin(phase) * 0.5 + 0.5) * 28
        const x = 8 + i * 8.5
        const y = 68 - h
        context.fillStyle = i % 2 === 0 ? 'rgba(34,211,238,0.85)' : 'rgba(244,114,182,0.8)'
        context.fillRect(x, y, 6.2, h)
      }
    }

    const drawPreCalculus = (t: number): void => {
      context.strokeStyle = 'rgba(148,163,184,0.36)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(8, 68)
      context.lineTo(72, 68)
      context.moveTo(40, 10)
      context.lineTo(40, 72)
      context.stroke()

      context.strokeStyle = '#a855f7'
      context.lineWidth = 2
      context.beginPath()
      for (let px = 10; px <= 70; px += 1) {
        const nx = (px - 40) / 14
        const y = 66 - nx * nx * 8
        if (px === 10) context.moveTo(px, y)
        else context.lineTo(px, y)
      }
      context.stroke()

      const loop = (t * 0.00025) % 1
      const px = 10 + loop * 60
      const nx = (px - 40) / 14
      const py = 66 - nx * nx * 8
      context.fillStyle = '#22d3ee'
      context.beginPath()
      context.arc(px, py, 3.4, 0, Math.PI * 2)
      context.fill()
    }

    const drawDifferential = (t: number): void => {
      const sampleX = 10 + ((t * 0.00022) % 1) * 60

      context.strokeStyle = 'rgba(148,163,184,0.36)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(8, 40)
      context.lineTo(72, 40)
      context.stroke()

      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2
      context.beginPath()
      for (let px = 8; px <= 72; px += 1) {
        const xNorm = (px - 8) / 64
        const y = 40 - Math.sin(xNorm * Math.PI * 2.2) * 18
        if (px === 8) context.moveTo(px, y)
        else context.lineTo(px, y)
      }
      context.stroke()

      const xNorm = (sampleX - 8) / 64
      const y = 40 - Math.sin(xNorm * Math.PI * 2.2) * 18
      const derivative = -Math.cos(xNorm * Math.PI * 2.2) * 18 * ((Math.PI * 2.2) / 64)
      const tangentHalf = 16

      context.strokeStyle = '#facc15'
      context.lineWidth = 1.8
      context.beginPath()
      context.moveTo(sampleX - tangentHalf, y - derivative * tangentHalf)
      context.lineTo(sampleX + tangentHalf, y + derivative * tangentHalf)
      context.stroke()

      context.fillStyle = '#f472b6'
      context.beginPath()
      context.arc(sampleX, y, 3.2, 0, Math.PI * 2)
      context.fill()
    }

    const drawIntegral = (t: number): void => {
      const density = 6 + Math.floor(((Math.sin(t * 0.0012) * 0.5 + 0.5) * 18))

      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2
      context.beginPath()
      for (let px = 8; px <= 72; px += 1) {
        const xNorm = (px - 8) / 64
        const y = 58 - (xNorm * xNorm * 16 + Math.sin(xNorm * Math.PI * 2) * 4)
        if (px === 8) context.moveTo(px, y)
        else context.lineTo(px, y)
      }
      context.stroke()

      const barWidth = 64 / density
      context.fillStyle = 'rgba(34,211,238,0.2)'
      for (let i = 0; i < density; i += 1) {
        const x = 8 + i * barWidth
        const xNorm = (x - 8) / 64
        const curveY = 58 - (xNorm * xNorm * 16 + Math.sin(xNorm * Math.PI * 2) * 4)
        context.fillRect(x, curveY, Math.max(1, barWidth - 1), 68 - curveY)
      }
    }

    const drawTrig = (t: number): void => {
      const cx = 24
      const cy = 40
      const r = 16
      const angle = ((t * 0.0024) % (Math.PI * 2))
      const px = cx + Math.cos(angle) * r
      const py = cy - Math.sin(angle) * r

      context.strokeStyle = 'rgba(148,163,184,0.42)'
      context.lineWidth = 1
      context.beginPath()
      context.arc(cx, cy, r, 0, Math.PI * 2)
      context.stroke()

      context.strokeStyle = '#22d3ee'
      context.beginPath()
      context.moveTo(cx, cy)
      context.lineTo(px, py)
      context.stroke()

      context.fillStyle = '#f472b6'
      context.beginPath()
      context.arc(px, py, 2.8, 0, Math.PI * 2)
      context.fill()

      context.strokeStyle = 'rgba(34,211,238,0.7)'
      context.lineWidth = 1.3
      context.beginPath()
      for (let x = 44; x <= 76; x += 1) {
        const phase = ((x - 44) / 32) * Math.PI * 2 + angle
        const y = 30 - Math.sin(phase) * 8
        if (x === 44) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.stroke()

      context.strokeStyle = 'rgba(244,114,182,0.7)'
      context.beginPath()
      for (let x = 44; x <= 76; x += 1) {
        const phase = ((x - 44) / 32) * Math.PI * 2 + angle
        const y = 54 - Math.cos(phase) * 8
        if (x === 44) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.stroke()
    }

    const draw = (time: number): void => {
      context.clearRect(0, 0, logicalSize, logicalSize)

      if (moduleId === 'basic-concepts') drawBasicConcepts(time)
      else if (moduleId === 'pre-calculus') drawPreCalculus(time)
      else if (moduleId === 'differential') drawDifferential(time)
      else if (moduleId === 'integral') drawIntegral(time)
      else drawTrig(time)

      frame = window.requestAnimationFrame(draw)
    }

    if (!active) {
      context.clearRect(0, 0, logicalSize, logicalSize)
      return
    }

    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [active, moduleId])

  return <canvas ref={canvasRef} className="module-preview-canvas" aria-hidden="true" />
}

const ModuleCardItem = ({
  module,
  delayMs,
  isFavorite,
  isRevealed,
  reducedMotion,
  onToggleFavorite,
  onAccessModule,
}: ModuleCardItemProps) => {
  const { cardRef, glareRef, onMouseLeave: onTiltLeave, onMouseMove } = useCardTilt()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = (): void => {
    setIsHovered(true)
  }

  const handleMouseLeave = (): void => {
    onTiltLeave()
    setIsHovered(false)
  }

  const previewActive = isHovered && !reducedMotion

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
        <div className="module-icon-stage" aria-hidden="true">
          <span
            className={`module-icon ${isRevealed ? 'is-revealed' : ''} ${previewActive ? 'is-hover-hidden' : ''}`}
            style={{ transitionDelay: `${delayMs + 200}ms` }}
          >
            {module.icon}
          </span>
          <div className={`module-preview-shell ${previewActive ? 'is-visible' : ''}`}>
            <ModulePreviewCanvas moduleId={module.id} active={previewActive} />
          </div>
        </div>
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
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())
  const [sectionRevealed, setSectionRevealed] = useState(false)
  const { registerAttempt, completion } = useSpacedRepetition()

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const topModules = moduleCards.slice(0, 3)
  const bottomModules = moduleCards.slice(3)

  useSpringReveal({
    rootRef: sectionRef,
    selector: '.module-card',
    staggerMs: 60,
    disabled: reducedMotion,
  })

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
            reducedMotion={reducedMotion}
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
              reducedMotion={reducedMotion}
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
