type ModuleHeroProps = {
  icon: string
  badge: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  accuracy: number
  onContinue: () => void
}

const ModuleHero = ({
  icon,
  badge,
  title,
  description,
  progress,
  totalLessons,
  completedLessons,
  accuracy,
  onContinue,
}: ModuleHeroProps) => {
  const allDone = completedLessons === totalLessons
  const ctaLabel = allDone ? 'REVISAR MÓDULO →' : 'CONTINUAR AULA →'

  return (
    <section className="modulos-hero" aria-labelledby="modulos-hero-title">
      <div className="modulos-hero-icon-wrap" aria-hidden="true">{icon}</div>

      <div className="modulos-hero-body">
        <div className="modulos-hero-top">
          <span className="modulos-hero-badge">{badge}</span>
        </div>

        <h1 id="modulos-hero-title" className="modulos-hero-title">{title}</h1>
        <p className="modulos-hero-desc">{description}</p>

        <div className="modulos-hero-metrics" role="list" aria-label="Métricas do módulo">
          <div className="modulos-metric" role="listitem">
            <span className="modulos-metric-value">{progress}%</span>
            <span className="modulos-metric-label">Progresso</span>
          </div>
          <div className="modulos-metric" role="listitem">
            <span className="modulos-metric-value">{completedLessons}/{totalLessons}</span>
            <span className="modulos-metric-label">Aulas</span>
          </div>
          <div className="modulos-metric" role="listitem">
            <span className="modulos-metric-value">{accuracy}%</span>
            <span className="modulos-metric-label">Precisão</span>
          </div>
        </div>

        <div className="modulos-hero-actions">
          <button
            type="button"
            className="modulos-cta-btn"
            onClick={onContinue}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ModuleHero
