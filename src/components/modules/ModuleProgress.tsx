import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

type ModuleProgressProps = {
  percentage: number
}

const ModuleProgress = ({ percentage }: ModuleProgressProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const fillRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fill  = fillRef.current
    const label = labelRef.current
    if (!fill) return

    if (reducedMotion) {
      fill.style.width = `${percentage}%`
      return
    }

    const obj = { val: 0 }
    const tl  = gsap.timeline({ delay: 0.5 })

    tl.to(obj, {
      val: percentage,
      duration: 1.1,
      ease: 'power3.out',
      onUpdate: () => {
        const v = Math.round(obj.val)
        fill.style.width = `${obj.val}%`
        if (label) label.textContent = `${v}%`
      },
      onComplete: () => {
        gsap.to(fill, {
          filter: 'brightness(1.25)',
          duration: 1.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        })
      },
    })

    return () => { tl.kill(); gsap.killTweensOf(fill) }
  }, [reducedMotion, percentage])

  return (
    <div className="modulos-progress-section">
      <div className="modulos-progress-header">
        <span className="modulos-progress-label">Progresso do Módulo</span>
        <span
          ref={labelRef}
          className="modulos-progress-pct"
          aria-label={`${percentage} por cento`}
        >
          {reducedMotion ? `${percentage}%` : '0%'}
        </span>
      </div>
      <div
        className="modulos-progress-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Barra de progresso do módulo"
      >
        <div ref={fillRef} className="modulos-progress-fill" style={{ width: '0%' }} />
      </div>
    </div>
  )
}

export default ModuleProgress
