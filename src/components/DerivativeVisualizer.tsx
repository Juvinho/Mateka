import { useEffect, useMemo, useRef, useState } from 'react'

import { evaluateDerivative, evaluateFunction, type FunctionKey } from '../utils/math'

const functionLabels: Record<FunctionKey, string> = {
  x2: 'x^2',
  'x3-3x': 'x^3 - 3x',
  sin: 'sin(x)',
  exp: 'e^x',
  ln: 'ln(x)',
}

const domainByFunction: Record<FunctionKey, [number, number]> = {
  x2: [-3.2, 3.2],
  'x3-3x': [-3.2, 3.2],
  sin: [-Math.PI * 1.2, Math.PI * 1.2],
  exp: [-2.2, 2.4],
  ln: [0.1, 6],
}

const DerivativeVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [selectedFunction, setSelectedFunction] = useState<FunctionKey>('x3-3x')
  const [showDerivativeCurve, setShowDerivativeCurve] = useState(false)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const hoverXRef = useRef<number | null>(null)

  const [domainStart, domainEnd] = domainByFunction[selectedFunction]

  const derivativeValue = useMemo(() => {
    if (hoverX === null) return null
    const value = evaluateDerivative(selectedFunction, hoverX)
    return Number.isFinite(value) ? value : null
  }, [hoverX, selectedFunction])

  useEffect(() => {
    hoverXRef.current = hoverX
  }, [hoverX])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let initFrameA = 0
    let initFrameB = 0

    const draw = (): void => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (width < 2 || height < 2) return

      const dpr = window.devicePixelRatio || 1

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      context.clearRect(0, 0, width, height)

      const samples: Array<{ x: number; y: number }> = []
      const derivativeSamples: Array<{ x: number; y: number }> = []

      for (let i = 0; i <= 260; i += 1) {
        const x = domainStart + (i / 260) * (domainEnd - domainStart)
        const y = evaluateFunction(selectedFunction, x)
        const dy = evaluateDerivative(selectedFunction, x)

        if (Number.isFinite(y)) samples.push({ x, y })
        if (Number.isFinite(dy)) derivativeSamples.push({ x, y: dy })
      }

      const yValues = [
        ...samples.map((point) => point.y),
        ...(showDerivativeCurve ? derivativeSamples.map((point) => point.y) : []),
      ]

      let yMin = Math.min(...yValues)
      let yMax = Math.max(...yValues)

      if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
        yMin = -1
        yMax = 1
      }

      const padding = Math.max(1, (yMax - yMin) * 0.16)
      yMin -= padding
      yMax += padding

      const xToPx = (x: number): number => ((x - domainStart) / (domainEnd - domainStart)) * width
      const yToPx = (y: number): number => height - ((y - yMin) / (yMax - yMin)) * height

      context.strokeStyle = 'rgba(30,41,59,0.9)'
      context.lineWidth = 1

      for (let i = 0; i <= 10; i += 1) {
        const x = (i / 10) * width
        const y = (i / 10) * height

        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()

        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }

      if (0 >= domainStart && 0 <= domainEnd) {
        const xAxis = xToPx(0)
        context.beginPath()
        context.strokeStyle = 'rgba(148,163,184,0.8)'
        context.lineWidth = 1.4
        context.moveTo(xAxis, 0)
        context.lineTo(xAxis, height)
        context.stroke()
      }

      if (0 >= yMin && 0 <= yMax) {
        const yAxis = yToPx(0)
        context.beginPath()
        context.strokeStyle = 'rgba(148,163,184,0.8)'
        context.lineWidth = 1.4
        context.moveTo(0, yAxis)
        context.lineTo(width, yAxis)
        context.stroke()
      }

      context.beginPath()
      samples.forEach((point, index) => {
        const px = xToPx(point.x)
        const py = yToPx(point.y)
        if (index === 0) context.moveTo(px, py)
        else context.lineTo(px, py)
      })
      context.strokeStyle = '#22d3ee'
      context.lineWidth = 2.3
      context.stroke()

      if (showDerivativeCurve) {
        context.beginPath()
        derivativeSamples.forEach((point, index) => {
          const px = xToPx(point.x)
          const py = yToPx(point.y)
          if (index === 0) context.moveTo(px, py)
          else context.lineTo(px, py)
        })
        context.strokeStyle = '#ec4899'
        context.lineWidth = 2
        context.stroke()
      }

      if (hoverXRef.current !== null) {
        const boundedX = Math.min(domainEnd, Math.max(domainStart, hoverXRef.current))
        const fx = evaluateFunction(selectedFunction, boundedX)
        const dfx = evaluateDerivative(selectedFunction, boundedX)

        if (Number.isFinite(fx) && Number.isFinite(dfx)) {
          const tangentX1 = domainStart
          const tangentY1 = fx + dfx * (tangentX1 - boundedX)
          const tangentX2 = domainEnd
          const tangentY2 = fx + dfx * (tangentX2 - boundedX)

          context.beginPath()
          context.moveTo(xToPx(tangentX1), yToPx(tangentY1))
          context.lineTo(xToPx(tangentX2), yToPx(tangentY2))
          context.strokeStyle = '#eab308'
          context.lineWidth = 2
          context.stroke()

          context.beginPath()
          context.arc(xToPx(boundedX), yToPx(fx), 6, 0, Math.PI * 2)
          context.fillStyle = '#22d3ee'
          context.fill()

          context.fillStyle = '#f8fafc'
          context.font = '12px "JetBrains Mono", monospace'
          context.fillText(`f'(x) = ${dfx.toFixed(3)}`, 14, 20)
        }
      }

    }

    const scheduleDraw = (): void => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      frame = window.requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect()
      const localX = event.clientX - rect.left
      setHoverX(domainStart + (localX / rect.width) * (domainEnd - domainStart))
      scheduleDraw()
    }

    const onPointerLeave = (): void => {
      setHoverX(null)
      scheduleDraw()
    }

    const resizeObserver = new ResizeObserver(() => {
      scheduleDraw()
    })

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    resizeObserver.observe(canvas)

    initFrameA = window.requestAnimationFrame(() => {
      initFrameB = window.requestAnimationFrame(scheduleDraw)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(initFrameA)
      window.cancelAnimationFrame(initFrameB)

      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      resizeObserver.disconnect()
    }
  }, [domainEnd, domainStart, selectedFunction, showDerivativeCurve])

  const interpretationTone =
    derivativeValue === null
      ? 'neutral'
      : derivativeValue > 0.02
        ? 'positive'
        : derivativeValue < -0.02
          ? 'negative'
          : 'critical'

  return (
    <section id="derivadas" className="derivative-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">Visualizador de derivada</p>
        <h2>Incline a reta tangente e veja a variação instantânea.</h2>
      </header>

      <div className="derivative-layout">
        <div ref={wrapperRef} className="derivative-canvas-shell">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            role="img"
            aria-label="Gráfico interativo com reta tangente e derivada"
          />

          <div className="derivative-tooltip" aria-live="polite">
            {hoverX === null ? (
              <span>Mova o mouse no gráfico para explorar a tangente.</span>
            ) : (
              <span>
                f'(x) = {functionLabels[selectedFunction]} = {derivativeValue?.toFixed(3) ?? 'n/a'}
              </span>
            )}
          </div>
        </div>

        <aside className="derivative-controls">
          <label htmlFor="function-select">Função</label>
          <select
            id="function-select"
            value={selectedFunction}
            onChange={(event) => setSelectedFunction(event.target.value as FunctionKey)}
            aria-label="Selecionar função para derivar"
          >
            <option value="x2">x^2</option>
            <option value="x3-3x">x^3 - 3x</option>
            <option value="sin">sin(x)</option>
            <option value="exp">e^x</option>
            <option value="ln">ln(x)</option>
          </select>

          <label className="checkbox-toggle" htmlFor="show-derivative-curve">
            <input
              id="show-derivative-curve"
              type="checkbox"
              checked={showDerivativeCurve}
              onChange={(event) => setShowDerivativeCurve(event.target.checked)}
              aria-label="Mostrar curva da derivada"
            />
            Mostrar f'(x) como curva
          </label>

          <div className={`derivative-interpretation ${interpretationTone}`}>
            <p>Inclinação positiva → função está CRESCENDO ↗</p>
            <p>Inclinação negativa → função está DECRESCENDO ↘</p>
            <p>Inclinação zero → MÁXIMO ou MÍNIMO local ●</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default DerivativeVisualizer
