import { useEffect, useMemo, useRef, useState } from 'react'

import { exactIntegral, integrateRiemann } from '../utils/math'

type IntegralFunctionKey = 'sin' | 'x2'

const IntegralVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<IntegralFunctionKey>('sin')
  const [slices, setSlices] = useState(24)

  const rangeStart = 0
  const rangeEnd = Math.PI

  const fn = useMemo(() => {
    if (selectedFunction === 'sin') {
      return (x: number) => Math.sin(x)
    }

    return (x: number) => x * x
  }, [selectedFunction])

  const approximatedArea = useMemo(
    () => integrateRiemann(fn, rangeStart, rangeEnd, slices),
    [fn, rangeEnd, rangeStart, slices],
  )

  const exactArea = useMemo(
    () => exactIntegral(selectedFunction, rangeStart, rangeEnd),
    [rangeEnd, rangeStart, selectedFunction],
  )

  const errorPercent = useMemo(() => {
    if (exactArea === 0) return 0
    return Math.abs((approximatedArea - exactArea) / exactArea) * 100
  }, [approximatedArea, exactArea])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const dpr = window.devicePixelRatio || 1

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    context.clearRect(0, 0, width, height)

    const yMax = selectedFunction === 'sin' ? 1.2 : 10.4

    const xToPx = (x: number): number => ((x - rangeStart) / (rangeEnd - rangeStart)) * width
    const yToPx = (y: number): number => height - (y / yMax) * height

    context.strokeStyle = 'rgba(30,41,59,0.75)'
    context.lineWidth = 1

    for (let i = 0; i <= 8; i += 1) {
      const y = (i / 8) * height
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(width, y)
      context.stroke()
    }

    context.beginPath()
    context.moveTo(0, yToPx(0))
    context.lineTo(width, yToPx(0))
    context.strokeStyle = 'rgba(148,163,184,0.9)'
    context.stroke()

    const dx = (rangeEnd - rangeStart) / slices
    const melted = slices >= 60

    for (let i = 0; i < slices; i += 1) {
      const x = rangeStart + i * dx
      const value = Math.max(0, fn(x))

      const left = xToPx(x)
      const right = xToPx(x + dx)
      const top = yToPx(value)

      context.fillStyle = 'rgba(34,211,238,0.38)'
      context.fillRect(left, top, right - left, height - top)

      context.strokeStyle = melted ? 'rgba(34,211,238,0.1)' : 'rgba(34,211,238,0.45)'
      context.lineWidth = melted ? 0.6 : 1
      context.strokeRect(left, top, right - left, height - top)
    }

    context.beginPath()

    for (let i = 0; i <= 300; i += 1) {
      const x = rangeStart + (i / 300) * (rangeEnd - rangeStart)
      const y = fn(x)
      const px = xToPx(x)
      const py = yToPx(y)

      if (i === 0) context.moveTo(px, py)
      else context.lineTo(px, py)
    }

    context.strokeStyle = '#22d3ee'
    context.lineWidth = 2.4
    context.stroke()
  }, [fn, rangeEnd, rangeStart, selectedFunction, slices])

  return (
    <section id="integrais" className="integral-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">Visualizador de integrais</p>
        <h2>Veja as somas de Riemann convergindo para a área real.</h2>
      </header>

      <div className="integral-layout">
        <div className="integral-canvas-shell">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            role="img"
            aria-label="Gráfico com retângulos de Riemann e área aproximada"
          />
        </div>

        <aside className="integral-controls">
          <label htmlFor="integral-function">Função</label>
          <select
            id="integral-function"
            value={selectedFunction}
            onChange={(event) => setSelectedFunction(event.target.value as IntegralFunctionKey)}
            aria-label="Selecionar função para visualização da integral"
          >
            <option value="sin">f(x) = sin(x)</option>
            <option value="x2">f(x) = x^2</option>
          </select>

          <label htmlFor="slice-slider">Número de fatias: {slices}</label>
          <input
            id="slice-slider"
            type="range"
            min={2}
            max={100}
            step={1}
            value={slices}
            onChange={(event) => setSlices(Number(event.target.value))}
            aria-label="Número de fatias para soma de Riemann"
          />

          <div className="integral-metrics" aria-live="polite">
            <p>Área aproximada = {approximatedArea.toFixed(4)}</p>
            <p>Área exata = {exactArea.toFixed(4)}</p>
            <p>Erro: {errorPercent.toFixed(2)}%</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default IntegralVisualizer
