import { useEffect, useState } from 'react'

type LoadingScreenProps = {
  onComplete: () => void
}

const STORAGE_KEY = 'mateka:loaded'

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem(STORAGE_KEY) === 'true'

    if (alreadyLoaded) {
      onComplete()
      return
    }

    sessionStorage.setItem(STORAGE_KEY, 'true')

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true)
    }, 2000)

    const completeTimer = window.setTimeout(() => {
      onComplete()
    }, 2400)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className={`loading-screen ${isExiting ? 'is-exiting' : ''}`} aria-live="polite">
      <div className="loading-screen-scanlines" aria-hidden="true" />

      <div className="loading-screen-center">
        <svg
          className="loading-logo"
          viewBox="0 0 120 120"
          role="img"
          aria-label="Logo do Mateka inicializando"
        >
          <path
            d="M 22 96 L 22 24 L 42 24 L 60 58 L 78 24 L 98 24 L 98 96 L 80 96 L 80 58 L 60 90 L 40 58 L 40 96 Z"
            fill="none"
            stroke="url(#loadingLogoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="loadingLogoGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="loading-progress-track">
          <span className="loading-progress-bar" />
        </div>

        <p className="loading-caption">INICIALIZANDO SISTEMA...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
