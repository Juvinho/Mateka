import { useEffect, useRef, useState } from 'react'

const PEN_COLORS = ['#22d3ee', '#ec4899', '#a78bfa']
const ERASER_WIDTH = 18
const PEN_WIDTH = 2.5

type Tool = 'pen' | 'eraser'

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)

const EraserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d="M16 3l5 5-9.5 9.5H6l-3-3z" />
    <path d="M8.5 20.5H21" />
  </svg>
)

const ScratchPad = () => {
  const [visible, setVisible] = useState(true)
  const [tool, setTool] = useState<Tool>('pen')
  const [activeColor, setActiveColor] = useState(PEN_COLORS[0])
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
  }, [visible])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = ERASER_WIDTH
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = activeColor
      ctx.lineWidth = PEN_WIDTH
    }

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
            Limpar tudo
          </button>
        )}
      </div>

      {visible && (
        <>
          <div className="scratchpad-toolbar" role="toolbar" aria-label="Ferramentas de desenho">
            {PEN_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`scratchpad-tool${tool === 'pen' && activeColor === color ? ' is-active' : ''}`}
                style={{ color }}
                onClick={() => {
                  setTool('pen')
                  setActiveColor(color)
                }}
                aria-label={`Lápis ${color === PEN_COLORS[0] ? 'ciano' : color === PEN_COLORS[1] ? 'rosa' : 'roxo'}`}
                aria-pressed={tool === 'pen' && activeColor === color}
              >
                <PencilIcon />
              </button>
            ))}
            <button
              type="button"
              className={`scratchpad-tool${tool === 'eraser' ? ' is-active' : ''}`}
              onClick={() => setTool('eraser')}
              aria-label="Borracha"
              aria-pressed={tool === 'eraser'}
            >
              <EraserIcon />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            className={`scratchpad-canvas${tool === 'eraser' ? ' is-erasing' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            role="img"
            aria-label="Área de rascunho para desenhar as contas com o mouse ou o dedo"
          />
        </>
      )}
    </div>
  )
}

export default ScratchPad
