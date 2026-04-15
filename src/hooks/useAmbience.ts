import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'mateka:ambience'

const readInitial = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const useAmbience = () => {
  const [enabled, setEnabled] = useState(() => readInitial())
  const contextRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  const ensureAudioGraph = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
      return
    }

    if (contextRef.current) {
      if (contextRef.current.state === 'suspended') {
        await contextRef.current.resume()
      }
      return
    }

    let context: AudioContext
    try {
      context = new window.AudioContext()
    } catch {
      return
    }
    const gain = context.createGain()

    gain.gain.value = 0.0001
    gain.connect(context.destination)

    const padA = context.createOscillator()
    padA.type = 'sine'
    padA.frequency.value = 110

    const padB = context.createOscillator()
    padB.type = 'triangle'
    padB.frequency.value = 165

    const lfo = context.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.12

    const lfoGain = context.createGain()
    lfoGain.gain.value = 8

    lfo.connect(lfoGain)
    lfoGain.connect(padB.frequency)

    padA.connect(gain)
    padB.connect(gain)

    padA.start()
    padB.start()
    lfo.start()

    contextRef.current = context
    gainRef.current = gain
    oscillatorsRef.current = [padA, padB, lfo]
  }, [])

  const setAmbientLevel = useCallback((active: boolean): void => {
    if (!contextRef.current || !gainRef.current) return

    const now = contextRef.current.currentTime
    const target = active ? 0.035 : 0.001

    gainRef.current.gain.cancelScheduledValues(now)
    gainRef.current.gain.exponentialRampToValueAtTime(target, now + 0.45)
  }, [])

  const toggle = useCallback(async (): Promise<void> => {
    const next = !enabled

    if (next) {
      await ensureAudioGraph()
      setAmbientLevel(true)
    } else {
      setAmbientLevel(false)
    }

    setEnabled(next)
    localStorage.setItem(STORAGE_KEY, String(next))
  }, [enabled, ensureAudioGraph, setAmbientLevel])

  useEffect(() => {
    return () => {
      const context = contextRef.current
      if (!context) return

      oscillatorsRef.current.forEach((oscillator) => {
        try {
          oscillator.stop()
          oscillator.disconnect()
        } catch {
          // Ignore stop/disconnect race conditions on unmount.
        }
      })

      void context.suspend()
      contextRef.current = null
      gainRef.current = null
      oscillatorsRef.current = []
    }
  }, [])

  return {
    enabled,
    toggle,
  }
}
