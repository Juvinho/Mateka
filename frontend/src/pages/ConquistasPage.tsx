import MatekaLogo from '../components/MatekaLogo'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import { useAuth } from '../state/useAuth'
import { useAggregatedProgress } from '../hooks/useAggregatedProgress'
import { initialsFor } from '../lib/initials'

type Props = {
  onNavigate: (hash: string) => void
}

const ConquistasPage = ({ onNavigate }: Props) => {
  const { user } = useAuth()
  const { bestStreak, achievements } = useAggregatedProgress()
  const initials = initialsFor(user?.displayName)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="perfil-page">
      <header className="modulos-header">
        <div className="modulos-header-inner">
          <MatekaLogo onClick={() => onNavigate('#hero')} ariaLabel="Ir para o início" />
          <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
            <button type="button" className="modulos-breadcrumb-link" onClick={() => onNavigate('#perfil')}>
              Dashboard
            </button>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="modulos-breadcrumb-current">Conquistas</span>
          </nav>

          <div className="modulos-streak-badge" aria-label={`Streak de ${bestStreak} dias`}>
            🔥 {bestStreak} dias
          </div>

          <ProfileDropdown initials={initials} />
        </div>
      </header>

      <main className="perfil-shell">
        <div className="perfil-header">
          <div>
            <p className="section-kicker">Conquistas — {unlockedCount}/{achievements.length}</p>
            <h2>O que você já desbloqueou.</h2>
          </div>
        </div>

        <div className="perfil-achievements-grid">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`perfil-achievement${a.unlocked ? ' is-unlocked' : ''}`}
              title={a.description}
            >
              <span className="perfil-achievement__icon" aria-hidden="true">{a.unlocked ? a.icon : '🔒'}</span>
              <span className="perfil-achievement__title">{a.title}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ConquistasPage
