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
        <a href="#hero" className="modulos-logo" aria-label="Ir para o início">
          <div
            className="modulos-logo-mark"
            aria-hidden="true"
            style={{
              background: '#22d3ee',
              color: '#020617',
              fontWeight: 800,
              opacity: 1,
            }}
          >
            M
          </div>
          <span
            className="modulos-logo-text"
            style={{
              color: '#ffffff',
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              opacity: 1,
            }}
          >
            Mateka!
          </span>
        </a>

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
