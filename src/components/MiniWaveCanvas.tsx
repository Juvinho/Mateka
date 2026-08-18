import { useEffect, useMemo, useRef } from 'react'

import { lerp } from '../utils/math'

type MiniWaveCanvasProps = {
  focused: 'email' | 'password' | 'captcha' | null
  pulseKey: number
}

const WIDTH = 380
const HEIGHT = 60

const MiniWaveCanvas = ({ focused, pulseKey }: MiniWaveCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef({
    frequency: 0.035,
    amplitude: 9,
    pulseAmp: 0,
    targetFrequency: 0.035,
    targetAmplitude: 9,
  })

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const state = stateRef.current
    if (focused === 'email') {
      state.targetFrequency = 0.085
      state.targetAmplitude = 10
    } else if (focused === 'password') {
      state.targetFrequency = 0.04
      state.targetAmplitude = 18
    } else {
      state.targetFrequency = 0.035
      state.targetAmplitude = 9
    }
  }, [focused])

  useEffect(() => {
    if (pulseKey === 0) return
    stateRef.current.pulseAmp = 20
  }, [pulseKey])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let frame = 0

    const tick = (now: number): void => {
      const state = stateRef.current
      state.frequency = lerp(state.frequency, state.targetFrequency, 0.08)
      state.amplitude = lerp(state.amplitude, state.targetAmplitude, 0.08)
      state.pulseAmp = lerp(state.pulseAmp, 0, 0.05)

      const amplitude = state.amplitude + state.pulseAmp
      const time = reducedMotion ? 0 : now * 0.003

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      // background grid line
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, HEIGHT / 2)
      ctx.lineTo(WIDTH, HEIGHT / 2)
      ctx.stroke()

      // sinusoidal wave with subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, WIDTH, 0)
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.15)')
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.95)')
      gradient.addColorStop(1, 'rgba(244, 114, 182, 0.4)')

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(34, 211, 238, 0.5)'

      ctx.beginPath()
      for (let x = 0; x <= WIDTH; x += 2) {
        const y = HEIGHT / 2 + Math.sin(x * state.frequency + time) * amplitude
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // sliding dot — position wraps across width
      const dotX = reducedMotion
        ? WIDTH / 2
        : ((now * 0.12) % (WIDTH + 40)) - 20
      const dotY = HEIGHT / 2 + Math.sin(dotX * state.frequency + time) * amplitude

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.shadowBlur = 18
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // trailing echo
      ctx.fillStyle = 'rgba(34, 211, 238, 0.28)'
      ctx.beginPath()
      ctx.arc(dotX - 14, dotY, 2, 0, Math.PI * 2)
      ctx.fill()

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="login-mini-wave"
      width={WIDTH}
      height={HEIGHT}
      style={{
        width: '100%',
        height: '60px',
        borderRadius: '8px',
        display: 'block',
      }}
      aria-hidden="true"
    />
  )
}

export default MiniWaveCanvas
