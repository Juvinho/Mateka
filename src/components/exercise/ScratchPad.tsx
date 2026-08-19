import { useEffect, useRef, useState } from 'react'

const PEN_COLOR = '#22d3ee'

const ScratchPad = () => {
  const [visible, setVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = PEN_COLOR
    ctx.lineWidth = 2.5
  }, [visible])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true
    lastPointRef.current = getPos(e)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const last = lastPointRef.current
    if (!ctx || !last) return

    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPointRef.current = pos
  }

  const handlePointerUp = () => {
    isDrawingRef.current = false
    lastPointRef.current = null
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="scratchpad">
      <div className="scratchpad-controls">
        <button type="button" className="scratchpad-toggle" onClick={() => setVisible((v) => !v)}>
          {visible ? '✎ Ocultar rascunho' : '✎ Mostrar rascunho'}
        </button>
        {visible && (
          <button type="button" className="scratchpad-clear" onClick={handleClear}>
            Limpar
          </button>
        )}
      </div>
      {visible && (
        <canvas
          ref={canvasRef}
          className="scratchpad-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          role="img"
          aria-label="Área de rascunho para desenhar as contas com o mouse ou o dedo"
        />
      )}
    </div>
  )
}

export default ScratchPad
