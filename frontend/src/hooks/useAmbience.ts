import { useCallback, useEffect, useRef, useState } from 'react'
import ambienceSrc from '../assets/voice/ambiencia.mp3'

const STORAGE_KEY = 'mateka:ambience'
// The track builds up for its first 20 minutes; the steady ambience loop we
// actually want starts here. `ended` seeks back to this offset too, so the
// intro never replays once the graph settles into its loop.
const START_OFFSET_SECONDS = 20 * 60

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
  const audioElRef = useRef<HTMLAudioElement | null>(null)

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

    const audioEl = new Audio(ambienceSrc)
    audioEl.preload = 'auto'
    audioEl.addEventListener('loadedmetadata', () => {
      audioEl.currentTime = START_OFFSET_SECONDS
    }, { once: true })
    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = START_OFFSET_SECONDS
      void audioEl.play()
    })

    const source = context.createMediaElementSource(audioEl)
    source.connect(gain)

    contextRef.current = context
    gainRef.current = gain
    audioElRef.current = audioEl
  }, [])

  const setAmbientLevel = useCallback((active: boolean): void => {
    if (!contextRef.current || !gainRef.current) return

    const now = contextRef.current.currentTime
    const target = active ? 0.035 : 0.001

    gainRef.current.gain.cancelScheduledValues(now)
    gainRef.current.gain.exponentialRampToValueAtTime(target, now + 0.45)

    const audioEl = audioElRef.current
    if (!audioEl) return
    if (active) {
      void audioEl.play()
    } else {
      window.setTimeout(() => audioEl.pause(), 500)
    }
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
      audioElRef.current?.pause()

      const context = contextRef.current
      if (!context) return

      void context.suspend()
      contextRef.current = null
      gainRef.current = null
      audioElRef.current = null
    }
  }, [])

  return {
    enabled,
    toggle,
  }
}
