import { useEffect, useRef } from 'react'

type ModuleProgressProps = {
  percentage: number
}

const ModuleProgress = ({ percentage }: ModuleProgressProps) => {
  const fillRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return

    const frame = requestAnimationFrame(() => {
      fill.style.width = `${percentage}%`
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [percentage])

  return (
    <div className="modulos-progress-section">
      <div className="modulos-progress-header">
        <span className="modulos-progress-label">Progresso do Módulo</span>
        <span className="modulos-progress-pct" aria-label={`${percentage} por cento`}>
          {percentage}%
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
        <div ref={fillRef} className="modulos-progress-fill" />
      </div>
    </div>
  )
}

export default ModuleProgress
