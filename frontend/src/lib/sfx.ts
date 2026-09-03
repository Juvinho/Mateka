// Short UI feedback sounds, synthesized with the Web Audio API — no audio
// assets needed. Always called from inside a click handler (answer
// submission), so creating/resuming the AudioContext here never runs into
// autoplay-policy blocking.

import { getSettings } from './settingsStore'

let sharedContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!sharedContext) sharedContext = new Ctor()
  if (sharedContext.state === 'suspended') void sharedContext.resume()
  return sharedContext
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peakGain: number,
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq

  const startTime = ctx.currentTime + startOffset
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

export function playCorrectSound(): void {
  if (!getSettings().sfxEnabled) return
  const ctx = getContext()
  if (!ctx) return
  playTone(ctx, 523.25, 0, 0.12, 0.1) // C5
  playTone(ctx, 783.99, 0.09, 0.18, 0.1) // G5
}

export function playWrongSound(): void {
  if (!getSettings().sfxEnabled) return
  const ctx = getContext()
  if (!ctx) return
  playTone(ctx, 196, 0, 0.22, 0.08) // G3 — a soft, low thud, not harsh
}
