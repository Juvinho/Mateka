import { useEffect, useState } from 'react'

import { useMagneticButton } from '../hooks/useMagneticButton'

type NavBarProps = {
  ambienceEnabled: boolean
  onToggleAmbience: () => void
  onNavigate: (hash: string) => void
}

const NavBar = ({ ambienceEnabled, onToggleAmbience, onNavigate }: NavBarProps) => {
  const [scrolled, setScrolled] = useState(false)
  const {
    buttonRef: ctaButtonRef,
    textRef: ctaTextRef,
    onMouseMove: onCtaMouseMove,
    onMouseLeave: onCtaMouseLeave,
  } = useMagneticButton()

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 40)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className={`mateka-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <button
        className="mateka-logo"
        onClick={() => onNavigate('#hero')}
        type="button"
        aria-label="Ir para o topo da página"
      >
        <span className="mateka-logo-icon">
          <span className="mateka-logo-glyph">M</span>
        </span>
        <span className="mateka-logo-text">
          <span className="mateka-logo-white">Mat</span>
          <span className="mateka-logo-cyan">eka!</span>
        </span>
      </button>

      <nav className="mateka-nav-links" aria-label="Seções principais">
        <button type="button" onClick={() => onNavigate('#hero')} data-cursor>
          <span className="mateka-nav-link-label">Visualizador</span>
        </button>
        <button type="button" onClick={() => onNavigate('#why-it-matters')} data-cursor>
          <span className="mateka-nav-link-label">Aplicações</span>
        </button>
        <button type="button" onClick={() => onNavigate('#playground')} data-cursor>
          <span className="mateka-nav-link-label">Labs</span>
        </button>
      </nav>

      <div className="mateka-nav-actions">
        <button
          type="button"
          aria-label={ambienceEnabled ? 'Desativar som ambiente' : 'Ativar som ambiente'}
          className={`ambience-toggle ${ambienceEnabled ? 'is-active' : ''}`}
          onClick={onToggleAmbience}
          data-cursor
        >
          <span className="ambience-dot" aria-hidden="true" />
          <span className="ambience-label">
            ● AMBIENCE {ambienceEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          ref={ctaButtonRef}
          type="button"
          className="navbar-cta"
          onClick={() => onNavigate('#conteudos')}
          onMouseMove={onCtaMouseMove}
          onMouseLeave={onCtaMouseLeave}
          aria-label="Começar agora e ir para os módulos"
          data-cursor
        >
          <span ref={ctaTextRef}>Começar Agora</span>
        </button>
      </div>
    </header>
  )
}

export default NavBar
