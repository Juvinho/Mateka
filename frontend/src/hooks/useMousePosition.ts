import { useEffect, useState } from 'react'

export type MouseSnapshot = {
  x: number
  y: number
  isPointerDown: boolean
}

const initialState: MouseSnapshot = {
  x: 0,
  y: 0,
  isPointerDown: false,
}

export const useMousePosition = (): MouseSnapshot => {
  const [mouse, setMouse] = useState<MouseSnapshot>(initialState)

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      setMouse((prev) => ({
        ...prev,
        x: event.clientX,
        y: event.clientY,
      }))
    }

    const onDown = (): void => {
      setMouse((prev) => ({ ...prev, isPointerDown: true }))
    }

    const onUp = (): void => {
      setMouse((prev) => ({ ...prev, isPointerDown: false }))
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return mouse
}
