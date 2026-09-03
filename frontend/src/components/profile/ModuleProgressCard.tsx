import type { ModuleConfig } from '../../pages/ModulosPage'
import type { ModuleProgressState } from '../../state/useModuleProgress'

type Props = {
  config: ModuleConfig
  hash: string
  state: ModuleProgressState
  averageAccuracy: number
  onNavigate: (hash: string) => void
}

const ModuleProgressCard = ({ config, hash, state, averageAccuracy, onNavigate }: Props) => {
  const completedTrackNodes = config.track.filter((n) => state.completedNodeIds[n.id]).length
  const progressPct = config.track.length > 0 ? Math.round((completedTrackNodes / config.track.length) * 100) : 0
  const accuracyPct = Math.round(averageAccuracy * 100)

  return (
    <article className="perfil-module-card">
      <div className="perfil-module-card__header">
        <span className="perfil-module-card__icon" aria-hidden="true">{config.icon}</span>
        <div>
          <h3>{config.name}</h3>
          <p className="perfil-module-card__badge">{config.badge}</p>
        </div>
      </div>
      <p className="perfil-module-card__description">{config.description}</p>
      <div className="perfil-module-card__progress-row">
        <div className="perfil-module-card__progress-bar">
          <div className="perfil-module-card__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span>{progressPct}%</span>
      </div>
      <div className="perfil-module-card__stats">
        <span>{completedTrackNodes}/{config.track.length} etapas</span>
        <span>{accuracyPct}% de precisão</span>
      </div>
      <button type="button" className="btn-primary" onClick={() => onNavigate(hash)}>
        Continuar →
      </button>
    </article>
  )
}

export default ModuleProgressCard
