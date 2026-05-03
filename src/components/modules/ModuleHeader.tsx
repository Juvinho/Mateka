import MatekaLogo from '../MatekaLogo'
import ProfileDropdown from '../ui/ProfileDropdown'

type ModuleHeaderProps = {
  moduleName: string
  streak: number
  userInitials?: string
}

const ModuleHeader = ({ moduleName, streak, userInitials = 'U' }: ModuleHeaderProps) => {
  return (
    <header className="modulos-header">
      <div className="modulos-header-inner">
        <MatekaLogo onClick={() => { window.location.hash = '#hero' }} ariaLabel="Ir para o início" />

        <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
          <span>Dashboard</span>
          <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
          <span className="modulos-breadcrumb-current">{moduleName}</span>
        </nav>

        <div className="modulos-streak-badge" aria-label={`Streak de ${streak} dias`}>
          🔥 {streak} dias
        </div>

        <ProfileDropdown initials={userInitials} />
      </div>
    </header>
  )
}

export default ModuleHeader
