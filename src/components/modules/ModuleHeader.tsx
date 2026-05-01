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
          <div className="modulos-logo-mark" aria-hidden="true">M</div>
          <span className="modulos-logo-text">Mateka!</span>
        </a>

        <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
          <span>Dashboard</span>
          <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
          <span className="modulos-breadcrumb-current">{moduleName}</span>
        </nav>

        <div className="modulos-streak-badge" aria-label={`Streak de ${streak} dias`}>
          🔥 {streak} dias
        </div>

        <div className="modulos-avatar" role="img" aria-label="Avatar do usuário">
          {userInitials}
        </div>
      </div>
    </header>
  )
}

export default ModuleHeader
