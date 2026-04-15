type FooterProps = {
  onNavigate: (hash: string) => void
}

const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="mateka-footer reveal" data-reveal>
      <div className="mateka-footer-inner">
        <div className="footer-top">
          <div>
            <p className="footer-brand">Mateka!</p>
            <p className="footer-tagline">Não decore. Visualize.</p>
          </div>

          <nav className="footer-links" aria-label="Links do rodapé">
            <button type="button" onClick={() => onNavigate('#hero')}>
              Topo
            </button>
            <button type="button" onClick={() => onNavigate('#conteudos')}>
              Módulos
            </button>
            <button type="button" onClick={() => onNavigate('#playground')}>
              Playground
            </button>
          </nav>

          <p className="footer-support">Aprendizado visual de matemática para Ensino Médio e Universidade.</p>
        </div>

        <div className="footer-divider" aria-hidden="true" />
        <small className="footer-copyright">© {new Date().getFullYear()} Mateka. Visual-first math learning.</small>
      </div>
    </footer>
  )
}

export default Footer
