import muitoTristeImg from '../../assets/mascot/muito-triste.webp'

type Props = {
  answered: number
  correctCount: number
  onRetry: () => void
  onExit: () => void
}

const EndlessGameOver = ({ answered, correctCount, onRetry, onExit }: Props) => {
  return (
    <main className="error-page-shell">
      <section className="error-page-view reveal is-visible" data-reveal>
        <img
          src={muitoTristeImg}
          alt="Emy-chan, a mascote do Mateka, chorando"
          className="error-page-mascot"
        />
        <div className="error-page-content">
          <h1 className="error-page-code is-danger">Game Over</h1>
          <p className="error-page-title">Você perdeu suas 3 vidas.</p>
          <p className="error-page-message">
            Não fique assim, tente novamente! Você respondeu {answered} questõe{answered === 1 ? '' : 's'} nesta
            sessão, {correctCount} correta{correctCount === 1 ? '' : 's'}.
          </p>
          <div className="lesson-actions">
            <button type="button" className="btn-primary" onClick={onRetry}>
              Tentar novamente
            </button>
            <button type="button" className="btn-secondary" onClick={onExit}>
              Encerrar sessão
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EndlessGameOver
