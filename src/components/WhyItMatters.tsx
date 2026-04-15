import { useEffect, useMemo, useRef } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ACT0_END = 0.07
const ACT1_END = 0.40
const TRANSITION1_END = 0.48
const ACT2_END = 0.68
const TRANSITION2_END = 0.75

const TOTAL_SAMPLE_POINTS = 400
const MAX_TRAIL_POINTS = 25

type Segment = 'entry' | 'act1' | 'transition-1-2' | 'act2' | 'transition-2-3' | 'act3'

type StoryCard = {
  title: string
  subtitle: string
  description: string
  metricLabel: string
  metricUnit: string
}

const cards: StoryCard[] = [
  {
    title: 'Ato I',
    subtitle: 'Derivada viva',
    description: 'A reta tangente percorre a curva e revela a inclinacao local em tempo real.',
    metricLabel: "f'(x)",
    metricUnit: 'slope',
  },
  {
    title: 'Ato II',
    subtitle: 'Integral em fluxo',
    description: 'A area acumula da esquerda para a direita como um filme de soma continua.',
    metricLabel: 'Integral',
    metricUnit: 'area',
  },
  {
    title: 'Ato III',
    subtitle: 'Conexao total',
    description: 'Derivada e integral coexistem para fechar o Teorema Fundamental do Calculo.',
    metricLabel: 'FTC',
    metricUnit: 'd/dx',
  },
]

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

const normalizeSegment = (value: number, start: number, end: number): number => {
  if (end <= start) return 0
  return clamp((value - start) / (end - start), 0, 1)
}

const lerp = (start: number, end: number, amount: number): number => start + (end - start) * amount

const ScrollStory = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const indicatorRefs = useRef<Array<HTMLSpanElement | null>>([])
  const progressLineFillRef = useRef<HTMLSpanElement | null>(null)

  const derivativeValueRef = useRef<HTMLSpanElement | null>(null)
  const integralValueRef = useRef<HTMLSpanElement | null>(null)

  const activeStepRef = useRef(-2)
  const trailHistoryRef = useRef<Array<{ x: number; y: number }>>([])
  const currentActRef = useRef(-1)
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = canvasWrapperRef.current
    const canvas = canvasRef.current

    if (!section || !wrapper || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const dimensions = {
      width: 0,
      height: 0,
      amplitude: 0,
    }

    const flashFrames = { value: 0 }
    const lastSegment = { value: 'entry' as Segment }
    const lastProgress = { value: 0 }

    const formatMetricValue = (value: number | null): string => {
      if (value === null || !Number.isFinite(value)) return '--'
      return value.toFixed(3)
    }

    const writeDerivative = (value: number | null): void => {
      const label = derivativeValueRef.current
      if (!label) return
      label.textContent = formatMetricValue(value)
    }

    const writeIntegral = (value: number | null): void => {
      const label = integralValueRef.current
      if (!label) return
      label.textContent = formatMetricValue(value)
    }

    const measureCanvas = (): void => {
      const rect = wrapper.getBoundingClientRect()
      const width = Math.max(320, rect.width)
      const height = Math.max(240, rect.height)
      const dpr = Math.min(2, window.devicePixelRatio || 1)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      dimensions.width = width
      dimensions.height = height
      dimensions.amplitude = Math.max(44, height * 0.24)
    }

    const getCurveY = (x: number): number => {
      const baseY = dimensions.height / 2
      return baseY - dimensions.amplitude * Math.sin((x / dimensions.width) * 4 * Math.PI)
    }

    const drawAxes = (opacity: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2

      context.save()
      context.globalAlpha = clamp(opacity * 0.25, 0, 1)

      context.beginPath()
      context.moveTo(0, axisY)
      context.lineTo(width, axisY)
      context.strokeStyle = 'rgba(255,255,255,0.42)'
      context.lineWidth = 1
      context.stroke()

      const ticks = ['0', 'pi', '2pi', '3pi', '4pi']
      context.fillStyle = 'rgba(255,255,255,0.42)'
      context.font = '11px "JetBrains Mono", monospace'
      context.textAlign = 'center'

      ticks.forEach((label, index) => {
        const x = (index / 4) * width
        context.beginPath()
        context.moveTo(x, axisY - 4)
        context.lineTo(x, axisY + 4)
        context.strokeStyle = 'rgba(255,255,255,0.28)'
        context.stroke()

        context.fillText(label, x, axisY + 18)
      })

      context.restore()
    }

    const drawFunctionLabel = (): void => {
      context.save()
      context.globalAlpha = 0.5
      context.fillStyle = '#22d3ee'
      context.font = '600 13px "JetBrains Mono", monospace'
      context.textAlign = 'left'
      context.shadowBlur = 8
      context.shadowColor = '#22d3ee'
      context.fillText('f(x) = sin(x)', 16, 28)
      context.restore()
    }

    const drawCurve = (opacity: number, endX = dimensions.width): void => {
      const width = dimensions.width
      const maxX = clamp(endX, 0, width)
      if (maxX <= 0) return

      context.save()
      context.globalAlpha = clamp(opacity, 0, 1)
      context.beginPath()

      for (let x = 0; x <= maxX; x += 1) {
        const y = getCurveY(x)
        if (x === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }

      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2.5
      context.shadowBlur = 12
      context.shadowColor = '#22d3ee'
      context.stroke()
      context.restore()
    }

    const drawAreaUnderCurve = (startX: number, endX: number, opacity = 0.4): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2

      const from = clamp(startX, 0, width)
      const to = clamp(endX, 0, width)

      if (to <= from + 0.5) return

      const areaGradient = context.createLinearGradient(0, 0, 0, height)
      areaGradient.addColorStop(0, 'rgba(34,211,238,0.5)')
      areaGradient.addColorStop(0.5, 'rgba(34,211,238,0.3)')
      areaGradient.addColorStop(1, 'rgba(34,211,238,0.05)')

      context.save()
      context.globalAlpha = clamp(opacity, 0, 1)
      context.beginPath()
      context.moveTo(from, axisY)

      for (let x = from; x <= to; x += 1) {
        context.lineTo(x, getCurveY(x))
      }

      context.lineTo(to, axisY)
      context.closePath()
      context.fillStyle = areaGradient
      context.fill()
      context.restore()
    }

    const computeIntegral = (fillProgress: number): number => {
      const safeProgress = clamp(Number.isFinite(fillProgress) ? fillProgress : 0, 0, 1)
      const xMax = safeProgress * 4 * Math.PI
      if (xMax <= 0) return 0

      const n = 500
      const dx = xMax / n
      let sum = 0

      for (let i = 0; i < n; i += 1) {
        const x = i * dx + dx / 2
        sum += Math.sin(x) * dx
      }

      return sum
    }

    const drawLineReveal = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height

      context.clearRect(0, 0, width, height)

      const axisOpacity = Math.min(1, progress / 0.15)
      drawAxes(axisOpacity)

      const curveProgress = Math.max(0, (progress - 0.15) / 0.85)
      const pointsToShow = Math.floor(TOTAL_SAMPLE_POINTS * curveProgress)

      context.beginPath()
      let started = false

      for (let i = 0; i <= pointsToShow; i += 1) {
        const x = (i / TOTAL_SAMPLE_POINTS) * width
        const y = getCurveY(x)

        if (!started) {
          context.moveTo(x, y)
          started = true
        } else {
          context.lineTo(x, y)
        }
      }

      if (curveProgress < 1 && pointsToShow > 0) {
        const lastX = (pointsToShow / TOTAL_SAMPLE_POINTS) * width
        const lastY = getCurveY(lastX)

        const glow = context.createRadialGradient(lastX, lastY, 0, lastX, lastY, 12)
        glow.addColorStop(0, 'rgba(34,211,238,1)')
        glow.addColorStop(1, 'rgba(34,211,238,0)')

        context.fillStyle = glow
        context.beginPath()
        context.arc(lastX, lastY, 12, 0, Math.PI * 2)
        context.fill()
      }

      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2.5
      context.shadowBlur = 12
      context.shadowColor = '#22d3ee'
      context.stroke()

      writeDerivative(null)
      writeIntegral(null)
    }

    const drawTransitionParticles = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2

      const contactX = width
      const contactY = getCurveY(contactX)

      const slope = -dimensions.amplitude * Math.cos((contactX / width) * 4 * Math.PI) * ((4 * Math.PI) / width)
      const angle = Math.atan(slope)
      const lineLen = 140
      const x1 = contactX - lineLen * Math.cos(angle)
      const y1 = contactY - lineLen * Math.sin(angle)
      const x2 = contactX + lineLen * Math.cos(angle)
      const y2 = contactY + lineLen * Math.sin(angle)

      for (let i = 0; i < 20; i += 1) {
        const t = i / 19
        const startX = lerp(x1, x2, t)
        const startY = lerp(y1, y2, t)

        const endX = t * width * 0.3
        const endY = lerp(axisY, getCurveY(endX), 0.6)

        const currentX = lerp(startX, endX, progress)
        const currentY = lerp(startY, endY, progress) + Math.sin((t + progress) * Math.PI * 4) * (1 - progress) * 10

        context.save()
        context.globalAlpha = (1 - Math.abs(0.5 - t) * 1.2) * clamp(1 - progress * 0.2, 0.4, 1)
        context.beginPath()
        context.arc(currentX, currentY, 1.7 + progress * 1.3, 0, Math.PI * 2)
        context.fillStyle = '#f472b6'
        context.shadowBlur = 12
        context.shadowColor = '#f472b6'
        context.fill()
        context.restore()
      }
    }

    const drawAct1 = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2

      context.clearRect(0, 0, width, height)
      drawAxes(1)
      drawCurve(1)

      const contactX = progress * width
      const contactY = getCurveY(contactX)
      const xRadians = (contactX / width) * 4 * Math.PI
      const slope = -dimensions.amplitude * Math.cos(xRadians) * ((4 * Math.PI) / width)
      const angle = Math.atan(slope)

      trailHistoryRef.current.push({ x: contactX, y: contactY })
      if (trailHistoryRef.current.length > MAX_TRAIL_POINTS) {
        trailHistoryRef.current.shift()
      }

      trailHistoryRef.current.forEach((point, index) => {
        const age = (index + 1) / trailHistoryRef.current.length

        context.save()
        context.beginPath()
        context.arc(point.x, point.y, Math.max(1, 3 * age), 0, Math.PI * 2)
        context.fillStyle = `rgba(244,114,182,${(age * 0.6).toFixed(3)})`
        context.fill()
        context.restore()
      })

      const lineLen = 140
      const x1 = contactX - lineLen * Math.cos(angle)
      const y1 = contactY - lineLen * Math.sin(angle)
      const x2 = contactX + lineLen * Math.cos(angle)
      const y2 = contactY + lineLen * Math.sin(angle)

      const tangentOpacity = Math.min(1, progress / 0.1)
      context.save()
      context.globalAlpha = tangentOpacity
      context.beginPath()
      context.moveTo(x1, y1)
      context.lineTo(x2, y2)
      context.strokeStyle = '#f472b6'
      context.lineWidth = 2
      context.shadowBlur = 8
      context.shadowColor = '#f472b6'
      context.stroke()
      context.restore()

      context.beginPath()
      context.arc(contactX, contactY, 6, 0, Math.PI * 2)
      context.fillStyle = '#ffffff'
      context.shadowBlur = 12
      context.shadowColor = '#ffffff'
      context.fill()

      context.setLineDash([4, 6])
      context.beginPath()
      context.moveTo(contactX, contactY)
      context.lineTo(contactX, axisY)
      context.strokeStyle = 'rgba(255,255,255,0.25)'
      context.lineWidth = 1
      context.stroke()
      context.setLineDash([])

      const derivativeValue = -Math.cos(xRadians)
      writeDerivative(derivativeValue)
      writeIntegral(null)
    }

    const drawTransition1To2 = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height

      context.clearRect(0, 0, width, height)
      drawAxes(1)
      drawCurve(1)

      const contactX = width
      const contactY = getCurveY(contactX)

      const slope = -dimensions.amplitude * Math.cos((contactX / width) * 4 * Math.PI) * ((4 * Math.PI) / width)
      const angle = Math.atan(slope)
      const lineLen = 140

      context.save()
      context.globalAlpha = 1 - progress
      context.beginPath()
      context.moveTo(contactX - lineLen * Math.cos(angle), contactY - lineLen * Math.sin(angle))
      context.lineTo(contactX + lineLen * Math.cos(angle), contactY + lineLen * Math.sin(angle))
      context.strokeStyle = '#f472b6'
      context.lineWidth = 2
      context.shadowBlur = 10
      context.shadowColor = '#f472b6'
      context.stroke()
      context.restore()

      const areaWidth = progress * width * 0.3
      drawAreaUnderCurve(0, areaWidth, progress * 0.6)
      drawTransitionParticles(progress)

      writeDerivative(-Math.cos(4 * Math.PI))
      writeIntegral(computeIntegral(progress * 0.3))
    }

    const drawAct2 = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2
      const fillTo = progress * width

      context.clearRect(0, 0, width, height)
      drawAxes(1)

      const areaGradient = context.createLinearGradient(0, 0, 0, height)
      areaGradient.addColorStop(0, 'rgba(34,211,238,0.5)')
      areaGradient.addColorStop(0.5, 'rgba(34,211,238,0.3)')
      areaGradient.addColorStop(1, 'rgba(34,211,238,0.05)')

      context.beginPath()
      context.moveTo(0, axisY)

      for (let x = 0; x <= fillTo; x += 1) {
        context.lineTo(x, getCurveY(x))
      }

      context.lineTo(fillTo, axisY)
      context.closePath()
      context.fillStyle = areaGradient
      context.fill()

      context.beginPath()
      for (let x = 0; x <= fillTo; x += 1) {
        const y = getCurveY(x)
        if (x === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2.5
      context.shadowBlur = 10
      context.shadowColor = '#22d3ee'
      context.stroke()

      context.beginPath()
      context.moveTo(fillTo, 0)
      context.lineTo(fillTo, height)
      context.strokeStyle = 'rgba(34,211,238,0.3)'
      context.lineWidth = 1
      context.setLineDash([6, 4])
      context.stroke()
      context.setLineDash([])

      context.save()
      context.globalAlpha = 0.4
      drawCurve(1)
      context.restore()

      writeDerivative(null)
      writeIntegral(computeIntegral(progress))
    }

    const drawTransition2To3 = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const centerX = width / 2
      const centerY = getCurveY(centerX)

      context.clearRect(0, 0, width, height)
      drawAxes(1)
      drawAreaUnderCurve(0, width, 0.46)

      context.save()
      context.globalAlpha = 0.4 + progress * 0.6
      drawCurve(1)
      context.restore()

      context.save()
      context.globalAlpha = progress

      const lineLen = progress * 160
      const slope = -dimensions.amplitude * Math.cos(2 * Math.PI) * ((4 * Math.PI) / width)
      const angle = Math.atan(slope)

      context.beginPath()
      context.moveTo(centerX - lineLen * Math.cos(angle), centerY - lineLen * Math.sin(angle))
      context.lineTo(centerX + lineLen * Math.cos(angle), centerY + lineLen * Math.sin(angle))
      context.strokeStyle = '#f472b6'
      context.lineWidth = 2
      context.shadowBlur = 20 * progress
      context.shadowColor = '#f472b6'
      context.stroke()
      context.restore()

      writeDerivative(-Math.cos(2 * Math.PI))
      writeIntegral(computeIntegral(1))
    }

    const drawAct3 = (progress: number): void => {
      const width = dimensions.width
      const height = dimensions.height
      const axisY = height / 2

      context.clearRect(0, 0, width, height)
      drawAxes(1)
      drawAreaUnderCurve(0, width, 0.5)
      drawCurve(1)

      const contactX = progress * width
      const contactY = getCurveY(contactX)
      const slope = -dimensions.amplitude * Math.cos((contactX / width) * 4 * Math.PI) * ((4 * Math.PI) / width)
      const angle = Math.atan(slope)
      const lineLen = 120

      context.beginPath()
      context.moveTo(contactX - lineLen * Math.cos(angle), contactY - lineLen * Math.sin(angle))
      context.lineTo(contactX + lineLen * Math.cos(angle), contactY + lineLen * Math.sin(angle))
      context.strokeStyle = '#f472b6'
      context.lineWidth = 2
      context.shadowBlur = 10
      context.shadowColor = '#f472b6'
      context.stroke()

      context.beginPath()
      context.moveTo(contactX, contactY)
      context.lineTo(contactX, axisY)
      context.strokeStyle = 'rgba(168,85,247,0.6)'
      context.lineWidth = 2
      context.setLineDash([3, 3])
      context.stroke()
      context.setLineDash([])

      const pulse = 1 + Math.sin(progress * Math.PI * 10) * 0.14
      context.beginPath()
      context.arc(contactX, contactY, 7 * pulse, 0, Math.PI * 2)
      context.fillStyle = '#ffffff'
      context.shadowBlur = 16
      context.shadowColor = '#ffffff'
      context.fill()

      if (progress > 0.5) {
        const equationProgress = clamp((progress - 0.5) / 0.5, 0, 1)
        const equation = 'd/dx[int_0^x f(t)dt] = f(x)'
        const charsToShow = Math.floor(equation.length * equationProgress)
        const partialEquation = equation.slice(0, Math.max(1, charsToShow))

        context.save()
        context.globalAlpha = Math.min(1, equationProgress * 2)
        context.font = '700 16px "JetBrains Mono", monospace'
        context.fillStyle = '#22d3ee'
        context.shadowBlur = 20
        context.shadowColor = '#22d3ee'
        context.textAlign = 'center'
        context.fillText(partialEquation, width / 2, height - 35)

        const textWidth = context.measureText(partialEquation).width
        context.beginPath()
        context.moveTo(width / 2 - textWidth / 2, height - 28)
        context.lineTo(
          width / 2 - textWidth / 2 + textWidth * equationProgress,
          height - 28,
        )
        context.strokeStyle = 'rgba(34,211,238,0.4)'
        context.lineWidth = 1
        context.stroke()
        context.restore()
      }

      context.save()
      context.globalAlpha = 0.3
      context.beginPath()
      context.moveTo(contactX - 3, axisY)
      context.lineTo(contactX - 3, contactY)
      context.lineTo(contactX + 3, contactY)
      context.lineTo(contactX + 3, axisY)
      context.fillStyle = '#a855f7'
      context.fill()
      context.restore()

      const derivativeValue = -Math.cos((contactX / width) * 4 * Math.PI)
      writeDerivative(derivativeValue)
      writeIntegral(computeIntegral(progress))
    }

    const updateCards = (progress: number): void => {
      const step =
        progress < ACT0_END ? -1 :
        progress < TRANSITION1_END ? 0 :
        progress < TRANSITION2_END ? 1 :
        2

      if (step !== activeStepRef.current) {
        cards.forEach((_, index) => {
          const card = cardRefs.current[index]
          const dot = indicatorRefs.current[index]
          if (!card || !dot) return

          const isActive = index === step

          gsap.to(card, {
            opacity: isActive ? 1 : 0.35,
            scale: isActive ? 1 : 0.97,
            borderColor: isActive ? 'rgba(34,211,238,0.7)' : 'rgba(255,255,255,0.08)',
            boxShadow: isActive
              ? '0 0 30px rgba(34,211,238,0.15), inset 0 0 20px rgba(34,211,238,0.05)'
              : 'none',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
          })

          gsap.to(dot, {
            backgroundColor: isActive ? '#22d3ee' : 'rgba(255,255,255,0.2)',
            scale: isActive ? 1.3 : 1,
            duration: 0.3,
            overwrite: true,
          })
        })

        activeStepRef.current = step
      }

      if (progress >= 0.95) {
        const finalCard = cardRefs.current[2]
        if (finalCard) {
          gsap.to(finalCard, {
            opacity: 1,
            scale: 1,
            borderColor: 'rgba(168,85,247,0.8)',
            boxShadow: '0 0 40px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.05)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        const finalIndicator = indicatorRefs.current[2]
        if (finalIndicator) {
          gsap.to(finalIndicator, {
            backgroundColor: '#a855f7',
            scale: 1.35,
            duration: 0.4,
            overwrite: true,
          })
        }

        const ftcEl = section.querySelector<HTMLElement>('.ftc-equation')
        if (ftcEl) {
          gsap.to(ftcEl, {
            opacity: 1,
            color: '#22d3ee',
            textShadow: '0 0 12px rgba(34,211,238,0.5)',
            duration: 0.4,
            overwrite: true,
          })
        }
      }

      const lineProgress = clamp((progress - ACT0_END) / (1 - ACT0_END), 0, 1)

      if (progressLineFillRef.current) {
        gsap.to(progressLineFillRef.current, {
          height: `${lineProgress * 100}%`,
          duration: 0.1,
          overwrite: true,
          ease: 'none',
        })
      }
    }

    const drawByProgress = (progress: number): void => {
      lastProgress.value = clamp(progress, 0, 1)

      const newAct =
        lastProgress.value < ACT0_END ? 0 :
        lastProgress.value < ACT1_END ? 1 :
        lastProgress.value < TRANSITION1_END ? 2 :
        lastProgress.value < ACT2_END ? 3 :
        lastProgress.value < TRANSITION2_END ? 4 :
        5

      if (newAct !== currentActRef.current) {
        trailHistoryRef.current = []
        currentActRef.current = newAct
      }

      let segment: Segment

      if (lastProgress.value < ACT0_END) {
        segment = 'entry'
        drawLineReveal(normalizeSegment(lastProgress.value, 0, ACT0_END))
      } else if (lastProgress.value < ACT1_END) {
        segment = 'act1'
        drawAct1(normalizeSegment(lastProgress.value, ACT0_END, ACT1_END))
      } else if (lastProgress.value < TRANSITION1_END) {
        segment = 'transition-1-2'
        drawTransition1To2(normalizeSegment(lastProgress.value, ACT1_END, TRANSITION1_END))
      } else if (lastProgress.value < ACT2_END) {
        segment = 'act2'
        drawAct2(normalizeSegment(lastProgress.value, TRANSITION1_END, ACT2_END))
      } else if (lastProgress.value < TRANSITION2_END) {
        segment = 'transition-2-3'
        drawTransition2To3(normalizeSegment(lastProgress.value, ACT2_END, TRANSITION2_END))
      } else {
        segment = 'act3'
        drawAct3(normalizeSegment(lastProgress.value, TRANSITION2_END, 1))
      }

      if (segment !== lastSegment.value) {
        lastSegment.value = segment
        flashFrames.value = 2
      }

      if (flashFrames.value > 0) {
        context.save()
        context.fillStyle = 'rgba(34,211,238,0.03)'
        context.fillRect(0, 0, dimensions.width, dimensions.height)
        context.restore()
        flashFrames.value -= 1
      }

      drawFunctionLabel()
    }

    const renderFrame = (progress: number): void => {
      drawByProgress(progress)
      updateCards(progress)
    }

    measureCanvas()
    renderFrame(0)

    const resizeObserver = new ResizeObserver(() => {
      measureCanvas()
      renderFrame(lastProgress.value)
      ScrollTrigger.refresh()
    })

    resizeObserver.observe(wrapper)

    let masterTrigger: ScrollTrigger | null = null

    if (reducedMotion) {
      renderFrame(1)
    } else {
      masterTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          renderFrame(self.progress)
        },
      })
    }

    return () => {
      resizeObserver.disconnect()

      if (masterTrigger) {
        masterTrigger.kill()
      }
    }
  }, [reducedMotion])

  return (
    <section ref={sectionRef} id="why-it-matters" className="scroll-film-section reveal" data-reveal>
      <div className="scroll-film-sticky">
        <div className="scroll-film-layout">
          <div ref={canvasWrapperRef} className="scroll-film-canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="scroll-film-canvas"
              aria-label="Scroll film cinematico de derivada e integral"
            />
          </div>

          <aside className="scroll-film-panel">
            <header className="scroll-film-header">
              <p className="section-kicker">Scroll Film</p>
              <h2>Cinema do Calculo</h2>
            </header>

            <div className="scroll-film-card-stack">
              <span className="story-progress-line" aria-hidden="true" />
              <span
                ref={progressLineFillRef}
                className="story-progress-line-fill"
                aria-hidden="true"
              />

              {cards.map((card, index) => (
                <div key={card.title} className="scroll-film-card-row">
                  <span
                    ref={(element) => {
                      indicatorRefs.current[index] = element
                    }}
                    className="story-indicator-dot"
                    aria-hidden="true"
                  />

                  <div
                    ref={(element) => {
                      cardRefs.current[index] = element
                    }}
                    className="scroll-film-card"
                  >
                    <p className="scroll-film-card-title">{card.title}</p>
                    <h3>{card.subtitle}</h3>
                    <p className="scroll-film-card-description">{card.description}</p>

                    <p className="scroll-film-metric-label">
                      {card.metricLabel}
                      <span className="scroll-film-metric-unit">{card.metricUnit}</span>
                    </p>

                    {index === 0 ? (
                      <p className="scroll-film-metric-value" aria-live="polite">
                        <span ref={derivativeValueRef}>--</span>
                      </p>
                    ) : null}

                    {index === 1 ? (
                      <p className="scroll-film-metric-value" aria-live="polite">
                        <span ref={integralValueRef}>--</span>
                      </p>
                    ) : null}

                    {index === 2 ? (
                      <p className="scroll-film-metric-equation ftc-equation">
                        d/dx[int_0^x f(t)dt] = f(x)
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default ScrollStory
