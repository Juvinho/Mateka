import { useEffect, useMemo, useRef, useState } from 'react'

const WhyItMatters = () => {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const sectionRef = useRef<HTMLElement | null>(null)
  const [cardsVisible, setCardsVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return

    const target = sectionRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setCardsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.3,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="why-it-matters"
      className="why-it-matters-section reveal"
      data-reveal
    >
      <header className="section-header">
        <p className="section-kicker">Aplicacoes reais</p>
        <h2>Por que isso importa fora da sala de aula?</h2>
      </header>

      <div className="why-cards-grid">
        <article
          className={`why-card cyan ${cardsVisible ? 'is-visible' : ''}`}
          style={{ transitionDelay: '40ms' }}
        >
          <span className="top-border" />
          <svg viewBox="0 0 140 120" role="img" aria-label="Vetor rotacionando">
            <circle cx="70" cy="60" r="36" fill="none" stroke="rgba(34,211,238,0.2)" />
            <g>
              <line x1="70" y1="60" x2="104" y2="60" stroke="#22d3ee" strokeWidth="3" />
              <circle cx="104" cy="60" r="5" fill="#22d3ee" />
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 70 60"
                to="360 70 60"
                dur="3s"
                repeatCount="indefinite"
              />
            </g>
            <circle cx="96" cy="52" r="2" fill="rgba(34,211,238,0.7)">
              <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="82" cy="35" r="2" fill="rgba(34,211,238,0.5)">
              <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </svg>
          <h3>Game Dev</h3>
          <p>
            Vetores, angulos e trigonometria controlam camera, iluminacao e colisao em qualquer
            motor de jogo.
          </p>
        </article>

        <article
          className={`why-card pink ${cardsVisible ? 'is-visible' : ''}`}
          style={{ transitionDelay: '140ms' }}
        >
          <span className="top-border" />
          <svg viewBox="0 0 140 120" role="img" aria-label="Equalizador animado">
            <g className="equalizer-bars">
              {[16, 32, 20, 44, 28, 38].map((height, index) => (
                <rect
                  key={height}
                  x={18 + index * 18}
                  y={80 - height}
                  width="12"
                  height={height}
                  rx="4"
                />
              ))}
            </g>
            <path
              d="M 10 88 C 24 72, 38 104, 52 88 C 66 72, 80 104, 94 88 C 108 72, 122 104, 136 88"
              fill="none"
              stroke="rgba(244,114,182,0.8)"
              strokeWidth="2"
            />
          </svg>
          <h3>Sintese de Audio</h3>
          <p>
            Frequencia e amplitude deixam de ser teoria: voce manipula onda, harmonica e timbre em
            tempo real.
          </p>
        </article>

        <article
          className={`why-card purple ${cardsVisible ? 'is-visible' : ''}`}
          style={{ transitionDelay: '240ms' }}
        >
          <span className="top-border" />
          <svg viewBox="0 0 140 120" role="img" aria-label="Arco de engenharia com cargas">
            <path
              className="engineering-arc"
              d="M 12 84 Q 70 14 128 84"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3"
            />
            <line x1="70" y1="24" x2="70" y2="58" stroke="#c4b5fd" strokeWidth="2" />
            <polygon points="66,56 74,56 70,64" fill="#c4b5fd" />
            <line x1="40" y1="40" x2="40" y2="68" stroke="#c4b5fd" strokeWidth="2" />
            <polygon points="36,66 44,66 40,74" fill="#c4b5fd" />
            <line x1="100" y1="40" x2="100" y2="68" stroke="#c4b5fd" strokeWidth="2" />
            <polygon points="96,66 104,66 100,74" fill="#c4b5fd" />
          </svg>
          <h3>Engenharia</h3>
          <p>
            Curvas e distribuicao de carga explicam pontes, estruturas e materiais de forma
            intuitiva.
          </p>
        </article>
      </div>
    </section>
  )
}

export default WhyItMatters
