import { forwardRef } from 'react'

type MatekaLogoProps = {
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

const MatekaLogo = forwardRef<HTMLButtonElement, MatekaLogoProps>(
  ({ onClick, ariaLabel = 'Ir para o topo da página', className = '' }, ref) => {
    return (
      <button
        ref={ref}
        className={`mateka-logo ${className}`.trim()}
        onClick={onClick}
        type="button"
        aria-label={ariaLabel}
      >
        <span className="mateka-logo-icon">
          <span className="mateka-logo-glyph">M</span>
        </span>
        <span className="mateka-logo-text">
          <span className="mateka-logo-white">Mat</span>
          <span className="mateka-logo-cyan">eka!</span>
        </span>
      </button>
    )
  },
)

MatekaLogo.displayName = 'MatekaLogo'

export default MatekaLogo
