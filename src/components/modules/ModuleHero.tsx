import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

type ModuleHeroProps = {
  icon: string
  badge: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  accuracy: number
  onContinue: () => void
}

const ModuleHero = ({
  icon,
  badge,
  title,
  description,
  progress,
  totalLessons,
  completedLessons,
  accuracy,
  onContinue,
}: ModuleHeroProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const iconRef    = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  const progressValRef  = useRef<HTMLSpanElement>(null)
  const lessonsValRef   = useRef<HTMLSpanElement>(null)
  const accuracyValRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion) return

    const els = (
      [
        iconRef.current,
        badgeRef.current,
        titleRef.current,
        descRef.current,
        metricsRef.current,
        ctaRef.current,
      ] as (HTMLElement | null)[]
    ).filter((el): el is HTMLElement => el !== null)

    const tl = gsap.timeline()
    tl.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
    })

    return () => { tl.kill() }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const progressEl = progressValRef.current
    const lessonsEl  = lessonsValRef.current
    const accuracyEl = accuracyValRef.current
    if (!progressEl || !lessonsEl || !accuracyEl) return

    const pObj = { val: 0 }
    const lObj = { val: 0 }
    const aObj = { val: 0 }

    const tl = gsap.timeline({ delay: 0.4 })
    tl.to(pObj, {
      val: progress,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => { progressEl.textContent = `${Math.round(pObj.val)}%` },
    }, 0)
    .to(lObj, {
      val: completedLessons,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => { lessonsEl.textContent = `${Math.round(lObj.val)}/${totalLessons}` },
    }, 0)
    .to(aObj, {
      val: accuracy,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => { accuracyEl.textContent = `${Math.round(aObj.val)}%` },
    }, 0)

    return () => { tl.kill() }
  }, [reducedMotion, progress, completedLessons, totalLessons, accuracy])

  const allDone = completedLessons === totalLessons
  const ctaLabel = allDone ? 'REVISAR MÓDULO →' : 'CONTINUAR AULA →'
  const hidden = !reducedMotion

  return (
    <section className="modulos-hero" aria-labelledby="modulos-hero-title">
      <div
        ref={iconRef}
        className="modulos-hero-icon-wrap"
        aria-hidden="true"
        style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
      >
        {icon}
      </div>

      <div className="modulos-hero-body">
        <div
          ref={badgeRef}
          className="modulos-hero-top"
          style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
        >
          <span className="modulos-hero-badge">{badge}</span>
        </div>

        <h1
          ref={titleRef}
          id="modulos-hero-title"
          className="modulos-hero-title"
          style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
        >
          {title}
        </h1>

        <p
          ref={descRef}
          className="modulos-hero-desc"
          style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
        >
          {description}
        </p>

        <div
          ref={metricsRef}
          className="modulos-hero-metrics"
          role="list"
          aria-label="Métricas do módulo"
          style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
        >
          <div className="modulos-metric" role="listitem">
            <span ref={progressValRef} className="modulos-metric-value">
              {reducedMotion ? `${progress}%` : '0%'}
            </span>
            <span className="modulos-metric-label">Progresso</span>
          </div>
          <div className="modulos-metric" role="listitem">
            <span ref={lessonsValRef} className="modulos-metric-value">
              {reducedMotion ? `${completedLessons}/${totalLessons}` : `0/${totalLessons}`}
            </span>
            <span className="modulos-metric-label">Aulas</span>
          </div>
          <div className="modulos-metric" role="listitem">
            <span ref={accuracyValRef} className="modulos-metric-value">
              {reducedMotion ? `${accuracy}%` : '0%'}
            </span>
            <span className="modulos-metric-label">Precisão</span>
          </div>
        </div>

        <div
          ref={ctaRef}
          className="modulos-hero-actions"
          style={{ opacity: hidden ? 0 : 1, transform: hidden ? 'translateY(16px)' : 'none' }}
        >
          <button type="button" className="modulos-cta-btn" onClick={onContinue}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ModuleHero
