import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import speechBubble from '../../assets/mascot/balao-fala.webp'
import { MOOD_ALT, MOOD_IMAGE, type Reaction } from '../../data/mascotReactions'

type Props = {
  reaction: Reaction
  onDone: () => void
}

const EXIT_GRACE_MS = 900
const FALLBACK_READ_MS_PER_SEGMENT = 3200

function segmentIndexForTime(segments: { start: number }[], t: number): number {
  let idx = 0
  for (let i = 0; i < segments.length; i += 1) {
    if (t >= segments[i].start) idx = i
    else break
  }
  return idx
}

const MascotToast = ({ reaction, onDone }: Props) => {
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [needsManualPlay, setNeedsManualPlay] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const isFirstSegmentRender = useRef(true)
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  const scheduleExitRef = useRef<(delayMs: number) => void>(() => {})

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const pose = reaction.segments[segmentIndex]
  const displayedText = pose.text

  const dismiss = () => {
    audioRef.current?.pause()
    const root = rootRef.current
    if (!root || reducedMotion) {
      doneRef.current()
      return
    }
    gsap.to(root, { opacity: 0, y: 16, scale: 0.94, duration: 0.25, ease: 'power2.in', onComplete: () => doneRef.current() })
  }

  // ── Entrance + audio + auto-dismiss ────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current
    const figure = figureRef.current
    const text = textRef.current
    if (!root) return

    let exitTimer: ReturnType<typeof setTimeout> | undefined
    const scheduleExit = (delayMs: number) => {
      window.clearTimeout(exitTimer)
      exitTimer = window.setTimeout(dismiss, delayMs)
    }
    scheduleExitRef.current = scheduleExit

    const audio = audioRef.current
    const fallbackMs = reaction.segments.length * FALLBACK_READ_MS_PER_SEGMENT

    if (audio) {
      audio
        .play()
        .then(() => {
          // real duration wasn't loaded yet when this fired on some browsers; fall back if 'ended' never comes
          scheduleExit((audio.duration || fallbackMs / 1000) * 1000 + EXIT_GRACE_MS)
        })
        .catch(() => {
          setNeedsManualPlay(true)
          // safety net in case the user never taps "Ouvir" — still let the toast go away eventually
          scheduleExit(fallbackMs)
        })
      audio.addEventListener('ended', () => scheduleExit(EXIT_GRACE_MS))
    } else {
      scheduleExit(fallbackMs)
    }

    if (reducedMotion) {
      gsap.set(root, { opacity: 1, y: 0, scale: 1 })
    } else if (figure && text) {
      gsap.set(root, { opacity: 0, y: 24, scale: 0.92 })
      gsap.set(figure, { opacity: 0, y: 16, scale: 0.85 })
      gsap.set(text, { opacity: 0, y: 6 })

      const tl = gsap.timeline()
      tl.to(root, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
      tl.to(figure, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, '-=0.15')
      tl.to(text, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, '-=0.15')
    }

    return () => window.clearTimeout(exitTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync mascot expression + bubble text to audio playback ────────────
  // Polls every animation frame instead of listening for 'timeupdate' —
  // browsers throttle that event to roughly 4x/second, which alone can put
  // the segment swap up to ~250ms behind the voice.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || reaction.segments.length < 2) return
    let rafId: number
    const tick = () => {
      const idx = segmentIndexForTime(reaction.segments, audio.currentTime)
      setSegmentIndex((prev) => (prev === idx ? prev : idx))
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [reaction.segments])

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
    if (reducedMotion) return

    const figure = figureRef.current
    const text = textRef.current

    if (figure) {
      gsap.fromTo(
        figure,
        { opacity: 0.4, scale: 0.92, filter: 'blur(2px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.3, ease: 'back.out(1.8)' },
      )
    }

    if (text) {
      gsap.fromTo(text, { opacity: 0, y: 3 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' })
    }
  }, [segmentIndex, reducedMotion])

  const handleManualPlay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => {
        setNeedsManualPlay(false)
        const fallbackMs = reaction.segments.length * FALLBACK_READ_MS_PER_SEGMENT
        scheduleExitRef.current((audio.duration || fallbackMs / 1000) * 1000 + EXIT_GRACE_MS)
      })
      .catch(() => {})
  }

  // Portal to <body>: some routes wrap page content in an ancestor with a
  // `filter` (the app-content loading transition), and per the CSS spec any
  // non-`none` filter/transform on an ancestor turns `position: fixed` into
  // "fixed relative to that ancestor" instead of the real viewport. Rendering
  // straight into body sidesteps that regardless of where this gets mounted.
  return createPortal(
    <div ref={rootRef} className="mascot-toast" role="status" aria-live="polite" style={{ opacity: 0 }}>
      <button type="button" className="mascot-toast-close" onClick={dismiss} aria-label="Fechar mensagem">
        ×
      </button>

      <div className="mascot-toast-bubble" style={{ backgroundImage: `url(${speechBubble})` }}>
        <p ref={textRef} className="mascot-toast-text">{displayedText}</p>
        {needsManualPlay && (
          <button type="button" className="mascot-toast-play" onClick={handleManualPlay} aria-label="Ouvir a mensagem">
            🔊 Ouvir
          </button>
        )}
      </div>

      <img
        ref={figureRef}
        src={MOOD_IMAGE[pose.mood]}
        alt={MOOD_ALT[pose.mood]}
        className="mascot-toast-figure"
      />

      <audio ref={audioRef} src={reaction.audio} preload="auto" />
    </div>,
    document.body,
  )
}

export default MascotToast
