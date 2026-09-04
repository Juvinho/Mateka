import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import miiChanObserving from '../../assets/mascot/mii-chan-observing.png'
import miiChanNeutral from '../../assets/mascot/mii-chan-neutral.png'
import miiChanPresenting from '../../assets/mascot/mii-chan-presenting.png'
import type { RankedEntry } from '../../state/useRanking'

interface RankingSectionProps {
  rankings: { moduleId: string; moduleName: string; entries: RankedEntry[] }[]
  localUserId: string
  onNavigate?: (hash: string) => void
}

type MiiPose = 'observing' | 'neutral' | 'presenting'

const SEGMENTS: { pose: MiiPose; text: string }[] = [
  {
    pose: 'presenting',
    text: 'Aqui estão as pontuações dos módulos... Me pediram para mostrar isso.',
  },
  {
    pose: 'observing',
    text: 'Se a sua posição não está boa, você só precisa errar menos.',
  },
  {
    pose: 'neutral',
    text: 'Os três primeiros de cada módulo ganham figurinhas exclusivas para o perfil e o fórum.',
  },
]

const POSE_IMAGE: Record<MiiPose, string> = {
  observing: miiChanObserving,
  neutral: miiChanNeutral,
  presenting: miiChanPresenting,
}

const POSE_ALT: Record<MiiPose, string> = {
  presenting: 'Mii-chan indicando a lista de pontuações com expressão desinteressada',
  observing: 'Mii-chan com a mão na cintura observando os resultados com indiferença',
  neutral: 'Mii-chan em postura séria e apática',
}

const MEDAL = ['🥇', '🥈', '🥉']

export function RankingSection({ rankings, localUserId, onNavigate }: RankingSectionProps) {
  const [segIdx, setSegIdx] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const mascotRef = useRef<HTMLImageElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const seg = SEGMENTS[segIdx]

  // Entrance animation on first visibility
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (prefersReduced) return

          gsap.fromTo(
            mascotRef.current,
            { opacity: 0, y: 30, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.4)' },
          )
          gsap.fromTo(
            bubbleRef.current,
            { opacity: 0, x: -16 },
            { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', delay: 0.2 },
          )
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Cycle through dialogue segments every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setSegIdx((prev) => (prev + 1) % SEGMENTS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  // Soft fade on text and pose swap
  useEffect(() => {
    const bubbleEl = bubbleRef.current
    const mascotEl = mascotRef.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (bubbleEl) {
      gsap.fromTo(bubbleEl, { opacity: 0.4, y: 4 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' })
    }
    if (mascotEl) {
      gsap.fromTo(mascotEl, { opacity: 0.8 }, { opacity: 1, duration: 0.35, ease: 'power1.out' })
    }
  }, [segIdx])

  // Show top-3 per module as a preview
  const previewData = rankings.map((r) => ({
    ...r,
    top3: r.entries.slice(0, 3),
  }))

  const handleOpenFull = () => {
    if (onNavigate) {
      onNavigate('#ranking-completo')
    } else {
      window.location.hash = '#ranking-completo'
    }
  }

  return (
    <section id="rankings" className="ranking-section" ref={sectionRef}>
      <div className="ranking-section__inner">
        {/* Mii-chan presenter */}
        <div className="ranking-section__presenter">
          <div className="ranking-section__mascot-wrapper">
            <img
              ref={mascotRef}
              src={POSE_IMAGE[seg.pose]}
              alt={POSE_ALT[seg.pose]}
              className="ranking-section__mascot mii-chan-mascot"
            />
          </div>
          <div ref={bubbleRef} className="ranking-section__bubble">
            <div className="ranking-section__bubble-author">
              <span className="ranking-section__bubble-badge">Mii-chan</span>
            </div>
            <p>{seg.text}</p>
          </div>
        </div>

        {/* Section heading */}
        <div className="ranking-section__content">
          <div className="ranking-section__header-block">
            <span className="ranking-section__kicker">Classificação Geral</span>
            <h2 className="ranking-section__title">Rankings por Módulo</h2>
            <p className="ranking-section__subtitle">
              Desempenho acumulado em cada módulo. Os três primeiros colocados ganham figurinhas exclusivas para exibir no perfil e no fórum.
            </p>
          </div>

          {/* Top-3 preview cards per module */}
          <div className="ranking-preview-grid">
            {previewData.map((r) => (
              <div key={r.moduleId} className="ranking-preview-card">
                <div className="ranking-preview-card__top">
                  <h3 className="ranking-preview-card__module">{r.moduleName}</h3>
                  <span className="ranking-preview-card__badge">Top 3</span>
                </div>

                {r.top3.length === 0 ? (
                  <p className="ranking-preview-card__empty">Nenhum resultado registrado ainda.</p>
                ) : (
                  <ol className="ranking-preview-list">
                    {r.top3.map((entry, i) => (
                      <li
                        key={entry.userId}
                        className={`ranking-preview-item ranking-preview-item--pos${i + 1} ${entry.userId === localUserId ? 'ranking-preview-item--local' : ''}`}
                      >
                        <span className="ranking-preview-item__medal">{MEDAL[i]}</span>
                        <span className="ranking-preview-item__name">
                          {entry.displayName}
                          {entry.userId === localUserId && (
                            <span className="ranking-preview-item__you"> (você)</span>
                          )}
                        </span>
                        {entry.rewardIcon && (
                          <span className="ranking-preview-item__sticker" title={entry.rewardLabel}>
                            {entry.rewardIcon}
                          </span>
                        )}
                        <span className="ranking-preview-item__pts">{entry.totalPoints} pts</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>

          <div className="ranking-section__cta-wrapper">
            <button
              type="button"
              className="ranking-section__cta"
              onClick={handleOpenFull}
              aria-label="Acessar página dedicada com o ranking completo de todos os módulos"
            >
              <span>Ver ranking completo</span>
              <span className="ranking-section__cta-arrow" aria-hidden="true">→</span>
            </button>
            <span className="ranking-section__cta-hint">
              Consulte a lista completa com todas as colocações e critérios de desempate
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
