import { useEffect, useMemo, useRef, useState } from 'react'

interface WaveDot {
  x: number
  type: 'max' | 'min' | 'zero'
  label: string
  opacity: number
  fadeFrames: number
}

import { WaveSynth, audioIsSupported } from '../utils/audio'
import { useMagneticButton } from '../hooks/useMagneticButton'
import { mapRange } from '../utils/math'

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 200

const WavePlayground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const synthRef = useRef<WaveSynth | null>(null)
  const [frequency, setFrequency] = useState(4)
  const [amplitude, setAmplitude] = useState(0.8)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [harmonicEnabled, setHarmonicEnabled] = useState(false)
  const markerOpacityRef = useRef(1)
  const dotsFadingRef = useRef(false)
  const fadeTimeoutRef = useRef<number | null>(null)
  const hasMountedRef = useRef(false)
  const {
    buttonRef: ctaButtonRef,
    textRef: ctaTextRef,
    onMouseMove: onCtaMouseMove,
    onMouseLeave: onCtaMouseLeave,
  } = useMagneticButton()

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const audioFrequency = useMemo(
    () => mapRange(frequency, 0.5, 8, 20, 880),
    [frequency],
  )

  const audioAmplitude = useMemo(
    () => mapRange(amplitude, 0, 1.2, 0.01, 0.07),
    [amplitude],
  )

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    if (reducedMotion) {
      markerOpacityRef.current = 1
      dotsFadingRef.current = false
      return
    }

    dotsFadingRef.current = true

    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current)
    }

    fadeTimeoutRef.current = window.setTimeout(() => {
      dotsFadingRef.current = false
      fadeTimeoutRef.current = null
    }, 170)

    return () => {
      if (!fadeTimeoutRef.current) return
      window.clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }, [frequency, reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let phase = 0

    const frequencyScale = frequency * 0.016
    const wavelength = (2 * Math.PI) / frequencyScale

    const dots: WaveDot[] = [
      { x: wavelength * 0.25, type: 'max',  label: 'max', opacity: 1, fadeFrames: 0 },
      { x: wavelength * 0.5,  type: 'zero', label: '0',   opacity: 1, fadeFrames: 0 },
      { x: wavelength * 0.75, type: 'min',  label: 'min', opacity: 1, fadeFrames: 0 },
    ]

    const draw = (): void => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const dpr = window.devicePixelRatio || 1

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      context.clearRect(0, 0, width, height)

      const centerY = height / 2
      const maxAmplitudePx = amplitude * (height * 0.32)

      const pointsPrimary: Array<{ x: number; y: number }> = []
      const pointsHarmonic: Array<{ x: number; y: number }> = []
      const pointsComposite: Array<{ x: number; y: number }> = []

      for (let x = 0; x <= width; x += 2) {
        const theta = x * frequencyScale + phase
        const yPrimary = centerY - Math.sin(theta) * maxAmplitudePx
        const yHarmonic = centerY - Math.sin(theta * 2) * maxAmplitudePx * 0.45
        const yComposite = harmonicEnabled ? centerY - ((centerY - yPrimary) + (centerY - yHarmonic)) : yPrimary

        pointsPrimary.push({ x, y: yPrimary })
        pointsHarmonic.push({ x, y: yHarmonic })
        pointsComposite.push({ x, y: yComposite })
      }

      const gradient = context.createLinearGradient(0, centerY - maxAmplitudePx, 0, centerY + maxAmplitudePx)
      gradient.addColorStop(0, 'rgba(34,211,238,0.35)')
      gradient.addColorStop(1, 'rgba(34,211,238,0)')

      context.beginPath()
      pointsPrimary.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y)
        else context.lineTo(point.x, point.y)
      })
      context.lineTo(width, centerY + maxAmplitudePx + 16)
      context.lineTo(0, centerY + maxAmplitudePx + 16)
      context.closePath()
      context.fillStyle = gradient
      context.fill()

      context.beginPath()
      pointsPrimary.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y)
        else context.lineTo(point.x, point.y)
      })
      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2.5
      context.stroke()

      if (harmonicEnabled) {
        context.beginPath()
        pointsHarmonic.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        })
        context.strokeStyle = '#ec4899'
        context.lineWidth = 2
        context.stroke()

        context.beginPath()
        pointsComposite.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        })
        context.strokeStyle = 'rgba(248,250,252,0.9)'
        context.lineWidth = 2
        context.stroke()
      }

      // Traveling dots — move left at the same speed as the wave
      const waveSpeed = 0.04 / frequencyScale

      if (!reducedMotion) {
        for (const dot of dots) {
          dot.x -= waveSpeed

          if (dot.x < -20) {
            dot.x = width + 20
            dot.fadeFrames = 15
            dot.opacity = 0
          }

          if (dot.fadeFrames > 0) {
            dot.opacity = 1 - dot.fadeFrames / 15
            dot.fadeFrames--
          } else {
            dot.opacity = 1
          }
        }
      }

      const isDotsFading = dotsFadingRef.current
      const targetMarkerOpacity = isDotsFading ? 0.18 : 1
      markerOpacityRef.current +=
        (targetMarkerOpacity - markerOpacityRef.current) * (isDotsFading ? 0.22 : 0.14)
      const markerOpacity = markerOpacityRef.current

      for (const dot of dots) {
        const dotY = centerY - Math.sin(dot.x * frequencyScale + phase) * maxAmplitudePx
        const radius = dot.type === 'zero' ? 5 : 7
        const color = dot.type === 'max' ? '#22d3ee' : dot.type === 'min' ? '#f472b6' : '#ffffff'
        const finalAlpha = markerOpacity * dot.opacity

        context.save()
        context.globalAlpha = finalAlpha
        context.shadowBlur = 12
        context.shadowColor = color
        context.beginPath()
        context.fillStyle = color
        context.arc(dot.x, dotY, radius, 0, Math.PI * 2)
        context.fill()

        context.font = '12px "JetBrains Mono", monospace'
        context.fillStyle = color
        context.shadowBlur = 8

        if (dot.type === 'max') {
          context.fillText(dot.label, dot.x + 10, dotY - 10)
        } else if (dot.type === 'min') {
          context.fillText(dot.label, dot.x + 10, dotY + 18)
        } else {
          context.fillText(dot.label, dot.x + 8, dotY - 8)
        }

        context.restore()
      }

      if (!reducedMotion) {
        phase += 0.04
      }

      frame = window.requestAnimationFrame(draw)
    }

    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [amplitude, frequency, harmonicEnabled, reducedMotion])

  useEffect(() => {
    if (!soundEnabled) return

    if (!audioIsSupported()) {
      return
    }

    if (!synthRef.current) {
      synthRef.current = new WaveSynth()
    }

    const synth = synthRef.current

    synth
      .start()
      .then(() => {
        synth.setFrequency(audioFrequency)
        synth.setAmplitude(audioAmplitude)
        synth.setHarmonicEnabled(harmonicEnabled, audioFrequency)
      })
      .catch(() => {
        synth.stop()
      })
  }, [soundEnabled, audioFrequency, audioAmplitude, harmonicEnabled])

  useEffect(() => {
    if (!soundEnabled || !synthRef.current) return

    synthRef.current.setFrequency(audioFrequency)
    synthRef.current.setAmplitude(audioAmplitude)
    synthRef.current.setHarmonicEnabled(harmonicEnabled, audioFrequency)
  }, [audioAmplitude, audioFrequency, harmonicEnabled, soundEnabled])

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
        fadeTimeoutRef.current = null
      }

      if (!synthRef.current) return
      synthRef.current.dispose()
      synthRef.current = null
    }
  }, [])

  const handleSoundToggle = (): void => {
    setSoundEnabled((previous) => {
      const next = !previous

      if (next && !audioIsSupported()) {
        return previous
      }

      if (!next && synthRef.current) {
        synthRef.current.stop()
      }

      return next
    })
  }

  return (
    <section id="playground" className="wave-playground-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">O playground</p>
        <h2>Arraste para alterar a frequência e sinta a matemática.</h2>
      </header>

      <div className={`wave-canvas-shell ${soundEnabled ? 'is-sounding' : ''}`}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="Playground de onda senoidal com frequência e amplitude dinâmicas"
        />
      </div>

      <div className="wave-controls">
        <label htmlFor="freq-slider" className="wave-slider-group">
          <span>FREQUÊNCIA</span>
          <input
            id="freq-slider"
            type="range"
            min={0.5}
            max={8}
            step={0.1}
            value={frequency}
            onChange={(event) => setFrequency(Number(event.target.value))}
            aria-label="Controlar frequência da onda"
          />
          <output>{frequency.toFixed(1)} Hz</output>
        </label>

        <label htmlFor="amp-slider" className="wave-slider-group">
          <span>AMPLITUDE</span>
          <input
            id="amp-slider"
            type="range"
            min={0}
            max={1.2}
            step={0.05}
            value={amplitude}
            onChange={(event) => setAmplitude(Number(event.target.value))}
            aria-label="Controlar amplitude da onda"
          />
          <output>{amplitude.toFixed(1)}</output>
        </label>

        <div className="wave-switches">
          <button
            type="button"
            className={`sound-toggle ${soundEnabled ? 'is-active' : ''}`}
            onClick={handleSoundToggle}
            aria-label={soundEnabled ? 'Desativar som do playground' : 'Ativar som do playground'}
          >
            {soundEnabled ? 'Som Ativo' : 'Ativar Som'}
          </button>

          <label className="harmonic-toggle" htmlFor="harmonic-toggle">
            <input
              id="harmonic-toggle"
              type="checkbox"
              checked={harmonicEnabled}
              onChange={(event) => setHarmonicEnabled(event.target.checked)}
              aria-label="Adicionar harmônica na onda"
            />
            Adicionar Harmônica
          </label>
        </div>

        {harmonicEnabled ? (
          <p className="harmonic-legend">sin(x) + sin(2x) = onda composta</p>
        ) : null}
      </div>

      <footer className="playground-cta-footer">
        <p>
          Entendeu o conceito em 5 segundos?
          <br />
          Imagine o que você aprende em 5 minutos.
        </p>
        <button
          ref={ctaButtonRef}
          type="button"
          className="btn-primary"
          aria-label="Começar agora"
          onMouseMove={onCtaMouseMove}
          onMouseLeave={onCtaMouseLeave}
          data-cursor
        >
          <span ref={ctaTextRef}>Começar Agora →</span>
        </button>
      </footer>
    </section>
  )
}

export default WavePlayground
