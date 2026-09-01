import MatekaLogo from '../components/MatekaLogo'
import emyPortrait from '../assets/mascot/radiante.webp'
import miiPortrait from '../assets/mascot/negative-emy.png'

type Props = {
  onNavigate: (hash: string) => void
}

const ConhecaEmyPage = ({ onNavigate }: Props) => {
  return (
    <div className="conheca-emy-page">
      <header className="modulos-header">
        <div className="modulos-header-inner">
          <MatekaLogo onClick={() => onNavigate('#hero')} ariaLabel="Ir para o início" />
          <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
            <button type="button" className="modulos-breadcrumb-link" onClick={() => onNavigate('#hero')}>
              Início
            </button>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="modulos-breadcrumb-current">Conheça a Emy</span>
          </nav>
        </div>
      </header>

      <main className="conheca-emy-shell">
        <div className="conheca-emy-header">
          <p className="section-kicker">As mascotes do Mateka</p>
          <h1>Conheça a Emy-chan e a Mii-chan</h1>
          <p className="conheca-emy-subtitle">
            As duas presenças que te acompanham pelo Mateka — uma te guiando pelo conteúdo, a
            outra guardando suas anotações.
          </p>
        </div>

        <section className="conheca-emy-video" aria-label="Vídeo da Emy-chan">
          <img src={emyPortrait} alt="Emy-chan, a mascote do Mateka, radiante e sorrindo" />
          <span className="conheca-emy-video-badge">🎬 Vídeo em breve</span>
          <p>Em breve, um vídeo da Emy-chan se apresentando por aqui.</p>
        </section>

        <div className="conheca-emy-cards">
          <article className="conheca-emy-card">
            <img src={emyPortrait} alt="Emy-chan" className="conheca-emy-card__portrait" />
            <div className="conheca-emy-card__body">
              <h2>Emy-chan</h2>
              <p className="conheca-emy-card__tagline">Sua guia pelo Mateka</p>
              <p>
                Chibi anime de cabelo roxo/rosa, olhos azuis e hoodie navy com detalhes pink.
                É a Emy-chan quem te recebe no primeiro acesso e quem aparece explicando cada
                módulo novo antes de você começar a estudar.
              </p>
              <p>
                Animada e didática — mas bem humana também: já confessou que Cayley-Hamilton
                ainda a deixa nervosa, e de vez em quando aparece meio gripada. Tem um shiba inu
                de estimação chamado Pi.
              </p>
            </div>
          </article>

          <article className="conheca-emy-card">
            <img src={miiPortrait} alt="Mii-chan" className="conheca-emy-card__portrait conheca-emy-card__portrait--mii" />
            <div className="conheca-emy-card__body">
              <h2>Mii-chan</h2>
              <p className="conheca-emy-card__tagline">A guardiã do seu caderno</p>
              <p>
                A contraparte mais quieta da Emy. Enquanto você percorre as seções e lições, é
                a Mii-chan quem fica de canto — e um clique nela abre o caderno inteligente, para
                anotar o que quiser sem perder o fio da lição.
              </p>
              <p>
                Não some durante os exercícios (é hora de focar!), e também dá espaço pra Emy-chan
                brilhar sozinha na primeira vez que você abre um módulo novo.
              </p>
            </div>
          </article>
        </div>

        <div className="lesson-actions">
          <button type="button" className="btn-primary" onClick={() => onNavigate('#modulos')}>
            Ver módulos
          </button>
          <button type="button" className="btn-secondary" onClick={() => onNavigate('#hero')}>
            Voltar para o início
          </button>
        </div>
      </main>
    </div>
  )
}

export default ConhecaEmyPage
