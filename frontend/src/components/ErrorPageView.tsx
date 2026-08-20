type ErrorAction = {
  label: string
  onClick: () => void
}

type ErrorPageViewProps = {
  code: string
  tone?: 'neutral' | 'danger' | 'warning'
  title: string
  message: string
  mascotSrc: string
  mascotAlt: string
  primaryAction: ErrorAction
  secondaryAction?: ErrorAction
}

const ErrorPageView = ({
  code,
  tone = 'neutral',
  title,
  message,
  mascotSrc,
  mascotAlt,
  primaryAction,
  secondaryAction,
}: ErrorPageViewProps) => {
  return (
    <main className="error-page-shell">
      <section className="error-page-view reveal is-visible" data-reveal>
        <img src={mascotSrc} alt={mascotAlt} className="error-page-mascot" />
        <div className="error-page-content">
          <h1 className={`error-page-code${tone !== 'neutral' ? ` is-${tone}` : ''}`}>Erro {code}</h1>
          <p className="error-page-title">{title}</p>
          <p className="error-page-message">{message}</p>
          <div className="lesson-actions">
            <button type="button" className="btn-primary" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </button>
            {secondaryAction ? (
              <button type="button" className="btn-secondary" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ErrorPageView
