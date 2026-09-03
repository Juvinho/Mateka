import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import mascotEntusiasmo from '../../assets/mascot/feliz-cumprimentando.webp'
import mascotNormal from '../../assets/mascot/sorridente.webp'
import mascotTimida from '../../assets/mascot/timida.webp'
import speechBubble from '../../assets/mascot/balao-fala.webp'
import introAudio from '../../assets/voice/matriz.mp3'
import { useMascotIntro } from '../../state/useMascotIntro'
import { getSettings } from '../../lib/settingsStore'

type Mood = 'entusiasmo' | 'normal' | 'timida'

// `start` times (seconds) are proportioned from the narration's real duration
// (32.29s) by character weight per segment — there's no forced-alignment
// transcript, so this is an approximation, not exact word-level sync.
const SEGMENTS: { mood: Mood; start: number; text: string }[] = [
  { mood: 'entusiasmo', start: 0, text: 'Oi, oi! Seja muito bem-vindo à seção de Matrizes.' },
  { mood: 'normal', start: 3.21, text: 'Aqui você vai entender como organizar números em linhas e colunas,' },
  { mood: 'entusiasmo', start: 7.25, text: 'e vai descobrir que isso é muito mais poderoso do que parece!' },
  { mood: 'timida', start: 11.12, text: 'Confesso que Cayley-Hamilton ainda me deixa nervosa às vezes...' },
  { mood: 'normal', start: 16.05, text: 'mas prometo explicar tudo com calma, passo a passo.' },
  {
    mood: 'entusiasmo',
    start: 19.44,
    text: 'Vamos começar com o básico: o que é uma matriz e como ela é montada. Depois seguimos para operações, determinantes e inversas!',
  },
  { mood: 'normal', start: 27.71, text: 'Escolhe um dos exemplos aí embaixo pra começar,' },
  { mood: 'entusiasmo', start: 30.62, text: 'e bons estudos, combinado?' },
]

const MOOD_IMAGE: Record<Mood, string> = {
  entusiasmo: mascotEntusiasmo,
  normal: mascotNormal,
  timida: mascotTimida,
}

const MOOD_ALT: Record<Mood, string> = {
  entusiasmo: 'Emy-chan, a mascote do Mateka, animada e acenando',
  normal: 'Emy-chan, a mascote do Mateka, sorrindo calmamente',
  timida: 'Emy-chan, a mascote do Mateka, um pouco tímida',
}

function segmentIndexForTime(t: number): number {
  let idx = 0
  for (let i = 0; i < SEGMENTS.length; i += 1) {
    if (t >= SEGMENTS[i].start) idx = i
    else break
  }
  return idx
}

const MatrizesIntro = () => {
  const { hasSeenIntro, markIntroSeen } = useMascotIntro()
  const [dismissed, setDismissed] = useState(false)
  const [needsManualPlay, setNeedsManualPlay] = useState(false)
  const [segmentIndex, setSegmentIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLImageElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const isFirstSegmentRender = useRef(true)

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const shouldRender = !hasSeenIntro && !dismissed
  const pose = SEGMENTS[segmentIndex]
  const displayedText = pose.text

  // ── Entrance ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldRender) return
    const root = rootRef.current
    const backdrop = backdropRef.current
    const figure = figureRef.current
    const bubble = bubbleRef.current
    const text = textRef.current
    if (!root || !backdrop || !figure || !bubble || !text) return

    const playAudio = () => {
      const audio = audioRef.current
      if (!audio) return
      audio.muted = !getSettings().emyVoiceEnabled
      audio.play().catch(() => setNeedsManualPlay(true))
    }

    if (reducedMotion) {
      gsap.set(root, { opacity: 1 })
      gsap.set(backdrop, { opacity: 1 })
      gsap.set(figure, { opacity: 1, y: 0, scale: 1 })
      gsap.set(bubble, { opacity: 1, y: 0, scale: 1 })
      gsap.set(text, { opacity: 1 })
      playAudio()
      return
    }

    gsap.set(root, { opacity: 1 })
    gsap.set(backdrop, { opacity: 0 })
    gsap.set(figure, { opacity: 0, y: 80, scale: 0.85, filter: 'blur(6px)' })
    gsap.set(bubble, { opacity: 0, y: 16, scale: 0.85, transformOrigin: 'bottom left' })
    gsap.set(text, { opacity: 0, y: 8 })

    const tl = gsap.timeline({ delay: 0.9 })
    tl.to(backdrop, { opacity: 1, duration: 0.35, ease: 'power1.out' })
    tl.to(figure, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.65, ease: 'back.out(1.6)' }, '<')
    tl.to(bubble, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2')
    tl.to(text, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15')
    tl.call(playAudio)

    return () => { tl.kill() }
  }, [shouldRender, reducedMotion])

  // ── Sync mascot expression + bubble text to audio playback ────────────
  // Polls every animation frame instead of listening for 'timeupdate' —
  // browsers throttle that event to roughly 4x/second, which alone can put
  // the segment swap up to ~250ms behind the voice.
  useEffect(() => {
    if (!shouldRender) return
    const audio = audioRef.current
    if (!audio) return
    let rafId: number
    const tick = () => {
      const idx = segmentIndexForTime(audio.currentTime)
      setSegmentIndex((prev) => (prev === idx ? prev : idx))
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [shouldRender])

  // ── React to a segment change: swap pose + text right away ─────────────
  // The text is already correct the instant this runs (React committed it
  // before this effect fires) — this only adds a quick, non-blocking polish
  // fade so the swap isn't a hard cut, without delaying when the right
  // words become readable.
  useEffect(() => {
    if (isFirstSegmentRender.current) {
      isFirstSegmentRender.current = false
      return
    }
    if (!shouldRender || reducedMotion) return

    const figure = figureRef.current
    const text = textRef.current

    if (figure) {
      gsap.fromTo(
        figure,
        { opacity: 0.4, scale: 0.94, filter: 'blur(2px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'back.out(1.8)' },
      )
    }

    if (text) {
      gsap.fromTo(text, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' })
    }
  }, [segmentIndex, shouldRender, reducedMotion])

  if (!shouldRender) return null

  const handleDismiss = () => {
    audioRef.current?.pause()
    const root = rootRef.current
    const backdrop = backdropRef.current
    if (!root || !backdrop || reducedMotion) {
      markIntroSeen()
      setDismissed(true)
      return
    }
    gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power1.in' })
    gsap.to(root, {
      opacity: 0,
      y: 24,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        markIntroSeen()
        setDismissed(true)
      },
    })
  }

  const handleReplay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    setSegmentIndex(0)
    audio.play().then(() => setNeedsManualPlay(false)).catch(() => setNeedsManualPlay(true))
  }

  // Portal to <body>: some routes wrap page content in an ancestor with a
  // `filter` (the app-content loading transition), and per the CSS spec any
  // non-`none` filter/transform on an ancestor turns `position: fixed` into
  // "fixed relative to that ancestor" instead of the real viewport. Rendering
  // straight into body sidesteps that regardless of where this gets mounted.
  return createPortal(
    <>
      <div
        ref={backdropRef}
        className="mascot-intro-backdrop"
        onClick={handleDismiss}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
      <div ref={rootRef} className="mascot-intro" role="dialog" aria-label="Mensagem de boas-vindas da Emy-chan" style={{ opacity: 0 }}>
        <button type="button" className="mascot-intro-close" onClick={handleDismiss} aria-label="Fechar mensagem">
          ×
        </button>

        <div ref={bubbleRef} className="mascot-intro-bubble" style={{ backgroundImage: `url(${speechBubble})` }}>
          <p ref={textRef} className="mascot-intro-text">{displayedText}</p>
          <button
            type="button"
            className={`mascot-intro-replay${needsManualPlay ? ' is-prompting' : ''}`}
            onClick={handleReplay}
            aria-label="Ouvir a introdução novamente"
          >
            🔊 {needsManualPlay ? 'Ouvir' : 'Ouvir de novo'}
          </button>
        </div>

        <img
          ref={figureRef}
          src={MOOD_IMAGE[pose.mood]}
          alt={MOOD_ALT[pose.mood]}
          className="mascot-intro-figure"
        />

        <audio ref={audioRef} src={introAudio} preload="auto" />
      </div>
    </>,
    document.body,
  )
}

export default MatrizesIntro
