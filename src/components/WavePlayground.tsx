import { useEffect, useMemo, useRef, useState } from 'react'

interface WaveDot {
  x: number
  y: number
  label: string
  color: string
  labelPosition: 'above' | 'below' | 'right'
  opacity: number
  fadeFrames: number
}

import { WaveSynth, audioIsSupported } from '../utils/audio'
import { useMagneticButton } from '../hooks/useMagneticButton'
import { useSpringReveal } from '../hooks/useSpringReveal'
import { mapRange } from '../utils/math'

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 200
const PHASE_INCREMENT = 0.03
const DOT_FADE_FRAMES = 20
const DOT_WRAP_PADDING = 20
const WAVE_SCALE_X = 62.5

function getWaveY(
  xCanvas: number,
  phase: number,
  centerY: number,
  amplitude: number,
  frequency: number,
  scaleX: number,
): number {
  return centerY - amplitude * Math.sin((xCanvas / scaleX) * frequency + phase)
}

function initDots(frequency: number, scaleX: number): WaveDot[] {
  const k = scaleX / frequency

  return [
    {
      x: (Math.PI / 2) * k,
      y: 0,
      label: 'max',
      color: '#22d3ee',
      labelPosition: 'above',
      opacity: 1,
      fadeFrames: 0,
    },
    {
      x: Math.PI * k,
      y: 0,
      label: '0',
      color: '#ffffff',
      labelPosition: 'right',
      opacity: 1,
      fadeFrames: 0,
    },
    {
      x: ((3 * Math.PI) / 2) * k,
      y: 0,
      label: 'min',
      color: '#f472b6',
      labelPosition: 'below',
      opacity: 1,
      fadeFrames: 0,
    },
  ]
}

const WavePlayground = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const synthRef = useRef<WaveSynth | null>(null)
  const [frequency, setFrequency] = useState(4)
  const [amplitude, setAmplitude] = useState(0.8)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [harmonicEnabled, setHarmonicEnabled] = useState(false)
  const [isDraggingAmplitude, setIsDraggingAmplitude] = useState(false)
  const [dragAmplitudePercent, setDragAmplitudePercent] = useState(() => Math.round(0.8 * 100))

  const dotsRef = useRef<WaveDot[]>(initDots(frequency, WAVE_SCALE_X))
  const frequencyRef = useRef(frequency)
  const amplitudeRef = useRef(amplitude)
  const harmonicEnabledRef = useRef(harmonicEnabled)
  const phaseRef = useRef(0)
  const waveSpeedRef = useRef((PHASE_INCREMENT * WAVE_SCALE_X) / frequency)
  const hoverRef = useRef({ x: 0, y: 0, active: false })
  const dragRef = useRef({ active: false, startY: 0, startAmplitude: 0, moved: false })
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.01 }
    )
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

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

  useSpringReveal({
    rootRef: sectionRef,
    selector: '.wave-canvas-shell, .wave-controls, .playground-cta-footer',
    staggerMs: 60,
    disabled: reducedMotion,
  })

  const audioFrequency = useMemo(
    () => mapRange(frequency, 0.5, 8, 20, 880),
    [frequency],
  )

  const audioAmplitude = useMemo(
    () => mapRange(amplitude, 0.2, 1, 0.01, 0.07),
    [amplitude],
  )

  useEffect(() => {
    amplitudeRef.current = amplitude
    setDragAmplitudePercent(Math.round(amplitude * 100))
  }, [amplitude])

  useEffect(() => {
    harmonicEnabledRef.current = harmonicEnabled
  }, [harmonicEnabled])

  useEffect(() => {
    frequencyRef.current = frequency
    waveSpeedRef.current = (PHASE_INCREMENT * WAVE_SCALE_X) / frequency
    dotsRef.current = initDots(frequency, WAVE_SCALE_X)
  }, [frequency])

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const updateHoverPosition = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect()
      hoverRef.current.x = event.clientX - rect.left
      hoverRef.current.y = event.clientY - rect.top
      hoverRef.current.active = true
    }

    const stopDrag = (): void => {
      if (!dragRef.current.active) return
      const wasMoved = dragRef.current.moved
      dragRef.current.active = false
      dragRef.current.moved = false
      setIsDraggingAmplitude(false)

      if (!wasMoved && !reducedMotion) {
        setHarmonicEnabled((previous) => !previous)
      }
    }

    const onPointerDown = (event: PointerEvent): void => {
      updateHoverPosition(event)

      dragRef.current.active = true
      dragRef.current.startY = event.clientY
      dragRef.current.startAmplitude = amplitudeRef.current
      dragRef.current.moved = false

      setIsDraggingAmplitude(true)
      setDragAmplitudePercent(Math.round(amplitudeRef.current * 100))
    }

    const onPointerMove = (event: PointerEvent): void => {
      updateHoverPosition(event)

      if (!dragRef.current.active) return

      const deltaY = dragRef.current.startY - event.clientY
      if (Math.abs(deltaY) > 3) {
        dragRef.current.moved = true
      }

      const amplitudeShift = (deltaY / Math.max(1, canvas.clientHeight / 2)) * 0.8
      const nextAmplitude = Math.min(1, Math.max(0.2, dragRef.current.startAmplitude + amplitudeShift))

      setAmplitude(nextAmplitude)
      setDragAmplitudePercent(Math.round(nextAmplitude * 100))
    }

    const onPointerLeave = (): void => {
      hoverRef.current.active = false
      stopDrag()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)

      window.removeEventListener('pointerup', stopDrag)
      window.removeEventListener('pointercancel', stopDrag)
    }
  }, [reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0

    const draw = (): void => {
      frame = window.requestAnimationFrame(draw)
      if (!isVisibleRef.current) return

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
      const activeFrequency = frequencyRef.current
      const activeAmplitude = amplitudeRef.current
      const harmonicActive = harmonicEnabledRef.current
      if (!reducedMotion) {
        phaseRef.current += PHASE_INCREMENT
      }
      const phase = phaseRef.current
      const maxAmplitudePx = activeAmplitude * (height / 2)

      const pointsPrimary: Array<{ x: number; y: number }> = []
      const pointsHarmonic: Array<{ x: number; y: number }> = []
      const pointsComposite: Array<{ x: number; y: number }> = []

      for (let x = 0; x <= width; x += 1) {
        const yPrimary = getWaveY(x, phase, centerY, maxAmplitudePx, activeFrequency, WAVE_SCALE_X)
        const yHarmonic = getWaveY(x, phase, centerY, maxAmplitudePx * 0.45, activeFrequency * 2, WAVE_SCALE_X)
        const yComposite = harmonicActive ? centerY - ((centerY - yPrimary) + (centerY - yHarmonic)) : yPrimary

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

      if (harmonicActive) {
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

      const dots = dotsRef.current

      for (const dot of dots) {
        if (!reducedMotion) {
          dot.x -= waveSpeedRef.current

          if (dot.x < -DOT_WRAP_PADDING) {
            dot.x = width + DOT_WRAP_PADDING
            dot.fadeFrames = DOT_FADE_FRAMES
            dot.opacity = 0
          }

          if (dot.fadeFrames > 0) {
            dot.opacity = 1 - dot.fadeFrames / DOT_FADE_FRAMES
            dot.fadeFrames--
          } else {
            dot.opacity = 1
          }
        } else {
          dot.opacity = 1
        }

        dot.y = getWaveY(dot.x, phase, centerY, maxAmplitudePx, activeFrequency, WAVE_SCALE_X)
      }

      for (const dot of dots) {
        const radius = dot.label === '0' ? 5 : 7
        const finalAlpha = dot.opacity

        context.save()
        context.globalAlpha = finalAlpha
        context.shadowBlur = 16
        context.shadowColor = dot.color
        context.beginPath()
        context.fillStyle = dot.color
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
        context.fill()

        context.shadowBlur = 0
        context.font = 'bold 11px monospace'
        context.fillStyle = dot.color
        context.textAlign = 'center'

        if (dot.labelPosition === 'above') {
          context.fillText(dot.label, dot.x, dot.y - 14)
        } else if (dot.labelPosition === 'below') {
          context.fillText(dot.label, dot.x, dot.y + 22)
        } else {
          context.textAlign = 'left'
          context.fillText(dot.label, dot.x + 10, dot.y + 4)
        }

        context.restore()
      }

      if (harmonicActive) {
        context.save()
        context.textAlign = 'right'
        context.font = 'bold 11px monospace'
        context.fillStyle = 'rgba(248,250,252,0.95)'
        context.fillText('SUPERPOSIÇÃO', width - 12, 18)
        context.restore()
      }

      if (isDraggingAmplitude) {
        context.save()
        context.textAlign = 'left'
        context.font = 'bold 11px monospace'
        context.fillStyle = 'rgba(15,23,42,0.85)'
        context.fillRect(10, 10, 124, 24)
        context.strokeStyle = 'rgba(34,211,238,0.6)'
        context.strokeRect(10, 10, 124, 24)
        context.fillStyle = '#22d3ee'
        context.fillText(`AMPLITUDE: ${dragAmplitudePercent}%`, 16, 26)
        context.restore()
      }

      if (hoverRef.current.active) {
        const snapX = Math.max(0, Math.min(width, hoverRef.current.x))
        const theta = (snapX / WAVE_SCALE_X) * activeFrequency + phase
        const yPrimary = getWaveY(snapX, phase, centerY, maxAmplitudePx, activeFrequency, WAVE_SCALE_X)
        const yHarmonic = getWaveY(snapX, phase, centerY, maxAmplitudePx * 0.45, activeFrequency * 2, WAVE_SCALE_X)
        const snapY = harmonicActive ? centerY - ((centerY - yPrimary) + (centerY - yHarmonic)) : yPrimary
        const pulse = 1 + 0.2 * Math.sin((performance.now() / 600) * Math.PI * 2)

        const yValue = harmonicActive
          ? Math.sin(theta) + Math.sin(theta * 2) * 0.45
          : Math.sin(theta)
        const xInPi = ((snapX / WAVE_SCALE_X) * activeFrequency) / Math.PI

        context.save()
        context.beginPath()
        context.setLineDash([4, 4])
        context.moveTo(snapX, hoverRef.current.y)
        context.lineTo(snapX, snapY)
        context.strokeStyle = 'rgba(34,211,238,0.75)'
        context.lineWidth = 1.3
        context.stroke()
        context.setLineDash([])

        context.fillStyle = '#22d3ee'
        context.shadowBlur = 16
        context.shadowColor = '#22d3ee'
        context.beginPath()
        context.arc(snapX, snapY, 5.5 * pulse, 0, Math.PI * 2)
        context.fill()

        context.shadowBlur = 0
        context.fillStyle = 'rgba(2,6,23,0.84)'
        context.fillRect(snapX + 10, snapY - 34, 150, 24)
        context.strokeStyle = 'rgba(34,211,238,0.65)'
        context.strokeRect(snapX + 10, snapY - 34, 150, 24)
        context.fillStyle = '#bae6fd'
        context.font = '11px monospace'
        context.textAlign = 'left'
        context.fillText(`y = ${yValue.toFixed(2)} | x = ${xInPi.toFixed(2)}π`, snapX + 16, snapY - 18)
        context.restore()
      }
    }

    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

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
      if (!synthRef.current) return
      synthRef.current.dispose()
      synthRef.current = null
    }
  }, [])

  const handleFrequencyChange = (newFrequency: number): void => {
    frequencyRef.current = newFrequency
    waveSpeedRef.current = (PHASE_INCREMENT * WAVE_SCALE_X) / newFrequency
    dotsRef.current = initDots(newFrequency, WAVE_SCALE_X)
    setFrequency(newFrequency)
  }

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
    <section ref={sectionRef} id="playground" className="wave-playground-section reveal" data-reveal>
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
          data-cursor
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
            onChange={(event) => handleFrequencyChange(Number(event.target.value))}
            aria-label="Controlar frequência da onda"
          />
          <output>{frequency.toFixed(1)} Hz</output>
        </label>

        <label htmlFor="amp-slider" className="wave-slider-group">
          <span>AMPLITUDE</span>
          <input
            id="amp-slider"
            type="range"
            min={0.2}
            max={1}
            step={0.01}
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
