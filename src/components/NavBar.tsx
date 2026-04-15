import { useEffect, useMemo, useRef, useState } from 'react'

import { useMagneticButton } from '../hooks/useMagneticButton'

type NavBarProps = {
  ambienceEnabled: boolean
  onToggleAmbience: () => void
  onNavigate: (hash: string) => void
}

type NavItem = {
  id: string
  label: string
  hash: string
  previewTitle: string
  previewSubtitle: string
  previewGlyph: string
}

const navItems: NavItem[] = [
  {
    id: 'hero',
    label: 'Visualizador',
    hash: '#hero',
    previewTitle: 'Hero Interativo',
    previewSubtitle: 'Círculo trigonométrico em tempo real',
    previewGlyph: 'θ',
  },
  {
    id: 'why-it-matters',
    label: 'Scroll Film',
    hash: '#why-it-matters',
    previewTitle: 'Cinema do Cálculo',
    previewSubtitle: 'Derivada + integral em 4 atos',
    previewGlyph: '∫',
  },
  {
    id: 'playground',
    label: 'Labs',
    hash: '#playground',
    previewTitle: 'Playground de Ondas',
    previewSubtitle: 'Manipule frequência e harmônicas',
    previewGlyph: '∿',
  },
  {
    id: 'conteudos',
    label: 'Módulos',
    hash: '#conteudos',
    previewTitle: 'Trilha de Estudos',
    previewSubtitle: '5 módulos com visualizações',
    previewGlyph: '∑',
  },
]

const NavBar = ({ ambienceEnabled, onToggleAmbience, onNavigate }: NavBarProps) => {
  const [scrolled, setScrolled] = useState(false)
  const [activeItemId, setActiveItemId] = useState('hero')
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const navLinksRef = useRef<HTMLDivElement | null>(null)
  const buttonRefMap = useRef<Record<string, HTMLButtonElement | null>>({})

  const {
    buttonRef: ctaButtonRef,
    textRef: ctaTextRef,
    onMouseMove: onCtaMouseMove,
    onMouseLeave: onCtaMouseLeave,
  } = useMagneticButton()

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

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

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const next = visible[0]
        if (!next) return

        setActiveItemId(next.target.id)
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-20% 0px -35% 0px',
      },
    )

    for (const section of sections) {
      observer.observe(section)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const navLinks = navLinksRef.current
    const activeButton = buttonRefMap.current[activeItemId]

    if (!navLinks || !activeButton) {
      setPillStyle((previous) => ({ ...previous, opacity: 0 }))
      return
    }

    const linksRect = navLinks.getBoundingClientRect()
    const activeRect = activeButton.getBoundingClientRect()

    setPillStyle({
      left: activeRect.left - linksRect.left,
      width: activeRect.width,
      opacity: 1,
    })

    const recalc = (): void => {
      const links = navLinksRef.current
      const button = buttonRefMap.current[activeItemId]
      if (!links || !button) return

      const nextLinksRect = links.getBoundingClientRect()
      const nextActiveRect = button.getBoundingClientRect()

      setPillStyle({
        left: nextActiveRect.left - nextLinksRect.left,
        width: nextActiveRect.width,
        opacity: 1,
      })
    }

    window.addEventListener('resize', recalc)

    return () => {
      window.removeEventListener('resize', recalc)
    }
  }, [activeItemId])

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
        <div ref={navLinksRef} className="mateka-nav-links-track">
          <span
            className={`mateka-nav-pill ${reducedMotion ? 'is-static' : ''}`}
            aria-hidden="true"
            style={{
              width: `${pillStyle.width}px`,
              transform: `translateX(${pillStyle.left}px)`,
              opacity: pillStyle.opacity,
            }}
          />

          {navItems.map((item) => {
            const isActive = activeItemId === item.id
            const isHovered = hoveredItemId === item.id

            return (
              <div
                key={item.id}
                className="mateka-nav-link-wrap"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <button
                  ref={(element) => {
                    buttonRefMap.current[item.id] = element
                  }}
                  type="button"
                  className={`mateka-nav-link ${isActive ? 'is-active' : ''}`}
                  onClick={() => onNavigate(item.hash)}
                  data-cursor
                >
                  <span className="mateka-nav-link-label">{item.label}</span>
                </button>

                <div className={`mateka-nav-preview ${isHovered ? 'is-visible' : ''}`}>
                  <span className="mateka-nav-preview-glyph" aria-hidden="true">
                    {item.previewGlyph}
                  </span>
                  <strong>{item.previewTitle}</strong>
                  <small>{item.previewSubtitle}</small>
                </div>
              </div>
            )
          })}
        </div>
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
          <span className="ambience-label">● AMBIENCE {ambienceEnabled ? 'ON' : 'OFF'}</span>
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
