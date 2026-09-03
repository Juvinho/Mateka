import { useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import ModulePickerModal from '../components/profile/ModulePickerModal'
import ModuleProgressCard from '../components/profile/ModuleProgressCard'
import { useAuth } from '../state/useAuth'
import { useAggregatedProgress } from '../hooks/useAggregatedProgress'
import { initialsFor } from '../lib/initials'

type Props = {
  onNavigate: (hash: string) => void
}

const MeusModulosPage = ({ onNavigate }: Props) => {
  const { user } = useAuth()
  const { bestStreak, progressByModuleId, allModules, startedModules } = useAggregatedProgress()
  const [pickerOpen, setPickerOpen] = useState(false)
  const initials = initialsFor(user?.displayName)

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
            <span className="modulos-breadcrumb-current">Meus Módulos</span>
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
            <p className="section-kicker">Meus Módulos</p>
            <h2>Continue de onde parou.</h2>
          </div>
          <div className="perfil-header__actions">
            <button type="button" className="btn-secondary" onClick={() => setPickerOpen(true)}>
              Acessar outros módulos
            </button>
          </div>
        </div>

        {startedModules.length > 0 ? (
          <div className="perfil-modules-grid">
            {startedModules.map((m) => (
              <ModuleProgressCard
                key={m.config.moduleId}
                config={m.config}
                hash={m.hash}
                state={progressByModuleId[m.config.moduleId as keyof typeof progressByModuleId].state}
                averageAccuracy={progressByModuleId[m.config.moduleId as keyof typeof progressByModuleId].averageAccuracy}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="perfil-empty-state">
            <p>Você ainda não começou nenhum módulo.</p>
            <button type="button" className="btn-primary" onClick={() => setPickerOpen(true)}>
              Escolher meu primeiro módulo →
            </button>
          </div>
        )}
      </main>

      {pickerOpen ? (
        <ModulePickerModal
          modules={allModules}
          onSelect={(hash) => {
            setPickerOpen(false)
            onNavigate(hash)
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default MeusModulosPage
