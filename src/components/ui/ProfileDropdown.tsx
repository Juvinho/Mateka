import { useEffect, useRef, useState } from 'react'

type ProfileDropdownProps = {
  initials: string
}

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="6" r="3.5" stroke="#22d3ee" strokeWidth="1.5" />
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="2.5" stroke="#22d3ee" strokeWidth="1.5" />
    <path
      d="M9 1.5v1.2M9 15.3v1.2M1.5 9h1.2M15.3 9h1.2M3.46 3.46l.85.85M13.69 13.69l.85.85M14.54 3.46l-.85.85M4.31 13.69l-.85.85"
      stroke="#22d3ee"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const IconModules = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#22d3ee" strokeWidth="1.5" />
  </svg>
)

const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M6 2h6v7a3 3 0 01-6 0V2z" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 5H3.5a2 2 0 000 4H6M12 5h2.5a2 2 0 010 4H12" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 12v3M6.5 15h5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M7 3H3.5A1.5 1.5 0 002 4.5v9A1.5 1.5 0 003.5 15H7" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6l3 3-3 3M7 9h8" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type MenuItem = {
  icon: React.ReactNode
  label: string
  action: () => void
  danger?: boolean
  separator?: boolean
}

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  zIndex: 50,
  minWidth: '220px',
  padding: '8px',
  background: 'rgba(13, 27, 46, 0.96)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(34, 211, 238, 0.12)',
  borderRadius: '12px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
}

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '8px',
  background: 'none',
  border: 'none',
  width: '100%',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 150ms ease',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '14px',
  color: '#ffffff',
}

const separatorStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.06)',
  margin: '4px 0',
}

const ProfileDropdown = ({ initials }: ProfileDropdownProps) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return

    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  const menuItems: MenuItem[] = [
    {
      icon: <IconUser />,
      label: 'Meu Perfil',
      action: () => setOpen(false),
    },
    {
      icon: <IconSettings />,
      label: 'Configurações',
      action: () => setOpen(false),
    },
    {
      icon: <IconModules />,
      label: 'Meus Módulos',
      action: () => setOpen(false),
    },
    {
      icon: <IconTrophy />,
      label: 'Conquistas',
      action: () => setOpen(false),
    },
    {
      icon: <IconLogout />,
      label: 'Sair',
      action: () => setOpen(false),
      danger: true,
      separator: true,
    },
  ]

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        className="modulos-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu do perfil"
        aria-expanded={open}
        aria-haspopup="menu"
        style={{ cursor: 'pointer', background: 'none', border: '2px solid rgba(34,211,238,0.28)' }}
      >
        {initials}
      </button>

      {open && (
        <div style={dropdownStyle} role="menu" aria-label="Menu do perfil">
          {menuItems.map((item, i) => (
            <div key={item.label}>
              {item.separator && <div style={separatorStyle} aria-hidden="true" />}
              <button
                type="button"
                role="menuitem"
                style={{
                  ...itemStyle,
                  color: item.danger ? '#f87171' : '#ffffff',
                  background:
                    hoveredIndex === i
                      ? item.danger
                        ? 'rgba(248,113,113,0.08)'
                        : 'rgba(34,211,238,0.08)'
                      : 'transparent',
                }}
                onClick={item.action}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
