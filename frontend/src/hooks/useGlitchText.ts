import { useEffect, useMemo, useRef, useState } from 'react'

const GLITCH_CHARS = '!@#$%^&*<>{}[]|/\\\\ΔΩπ∫∑'

const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const getRandomChar = (): string => {
  const index = Math.floor(Math.random() * GLITCH_CHARS.length)
  return GLITCH_CHARS[index] ?? '!'
}

const scrambleText = (text: string, keepRatio: number): string => {
  return Array.from(text)
    .map((character) => {
      if (character === ' ') return character
      return Math.random() < keepRatio ? character : getRandomChar()
    })
    .join('')
}

export const useGlitchText = (text: string) => {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const [shadowSwapped, setShadowSwapped] = useState(false)

  const frameTimeoutsRef = useRef<number[]>([])
  const shadowIntervalRef = useRef<number | null>(null)
  const cycleTimeoutRef = useRef<number | null>(null)

  const clearGlitchTimers = (): void => {
    frameTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    frameTimeoutsRef.current = []

    if (shadowIntervalRef.current) {
      window.clearInterval(shadowIntervalRef.current)
      shadowIntervalRef.current = null
    }
  }

  const clearCycleTimer = (): void => {
    if (!cycleTimeoutRef.current) return
    window.clearTimeout(cycleTimeoutRef.current)
    cycleTimeoutRef.current = null
  }

  useEffect(() => {
    const triggerGlitch = (): void => {
      clearGlitchTimers()
      setIsGlitching(true)
      setShadowSwapped(false)

      shadowIntervalRef.current = window.setInterval(() => {
        setShadowSwapped((previous) => !previous)
      }, 40)

      frameTimeoutsRef.current.push(
        window.setTimeout(() => setDisplayText(scrambleText(text, 0)), 0),
      )
      frameTimeoutsRef.current.push(
        window.setTimeout(() => setDisplayText(scrambleText(text, 0.5)), 80),
      )
      frameTimeoutsRef.current.push(
        window.setTimeout(() => setDisplayText(scrambleText(text, 0.8)), 160),
      )
      frameTimeoutsRef.current.push(
        window.setTimeout(() => setDisplayText(text), 240),
      )
      frameTimeoutsRef.current.push(
        window.setTimeout(() => {
          setDisplayText(text)
          setIsGlitching(false)
          clearGlitchTimers()
        }, 600),
      )
    }

    const scheduleNext = (): void => {
      clearCycleTimer()
      cycleTimeoutRef.current = window.setTimeout(() => {
        triggerGlitch()
        scheduleNext()
      }, randomBetween(4000, 8000))
    }

    const kickoff = window.setTimeout(() => {
      triggerGlitch()
      scheduleNext()
    }, 20)

    return () => {
      window.clearTimeout(kickoff)
      clearGlitchTimers()
      clearCycleTimer()
    }
  }, [text])

  const glitchClass = useMemo(() => {
    if (!isGlitching) return ''
    return shadowSwapped ? 'glitch-shadow-a' : 'glitch-shadow-b'
  }, [isGlitching, shadowSwapped])

  return {
    displayText,
    isGlitching,
    glitchClass,
  }
}
