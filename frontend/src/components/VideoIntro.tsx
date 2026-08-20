import { useRef, useState } from 'react'
import posterSrc from '../assets/video/introducao-mateka-poster.jpg'
import videoSrc from '../assets/video/introducao-mateka.mp4'

const VideoIntro = () => {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setPlaying(true)
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {})
    })
  }

  return (
    <section className="video-intro-section reveal" data-reveal>
      <div className="section-header">
        <p className="section-kicker">Conheça o Mateka</p>
        <h2>Veja o site em ação</h2>
        <p className="video-intro-subtitle">Um tour rápido pela plataforma, com a Emy-chan.</p>
      </div>

      <div className={`video-intro-frame${playing ? ' is-playing' : ''}`}>
        {playing ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="video-intro-player"
            controls
            playsInline
          />
        ) : (
          <button
            type="button"
            className="video-intro-poster"
            onClick={handlePlay}
            aria-label="Reproduzir vídeo de introdução ao Mateka"
          >
            <img src={posterSrc} alt="" />
            <span className="video-intro-play-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="video-intro-duration">1:07</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default VideoIntro
