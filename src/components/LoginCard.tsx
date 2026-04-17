import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import gsap from 'gsap'
import SplitType from 'split-type'

import MatekaLogo from './MatekaLogo'
import MiniWaveCanvas from './MiniWaveCanvas'
import { createSymbolBurst } from '../utils/particles'
import { useLoginForm } from '../hooks/useLoginForm'

type LoginCardProps = {
  onSuccess: () => void
  onLogoClick: () => void
  onCreateAccount: () => void
  isVisible?: boolean
}

type ButtonState = 'default' | 'loading' | 'success'

const LOADING_DOTS = ['∫ calc_', '∫ calc.', '∫ calc..', '∫ calc...', '∫ calculando']
const MATH_PARTICLES = ['∫', '∑', '∂', 'π', '∞', '√', 'Δ', 'φ']

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const formatCounter = (active: number, uptime: number): string => {
  return `sessões ativas: ${active.toLocaleString('pt-BR')} • uptime: ${uptime.toFixed(2)}%`
}

const LoginCard = ({ onSuccess, onLogoClick, onCreateAccount, isVisible }: LoginCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const captchaRef = useRef<HTMLInputElement | null>(null)
  const emailWrapRef = useRef<HTMLDivElement | null>(null)
  const passwordWrapRef = useRef<HTMLDivElement | null>(null)
  const captchaWrapRef = useRef<HTMLDivElement | null>(null)
  const submitRef = useRef<HTMLButtonElement | null>(null)
  const submitLabelRef = useRef<HTMLSpanElement | null>(null)
  const createLinkRef = useRef<HTMLButtonElement | null>(null)

  const form = useLoginForm()

  const [emailScan, setEmailScan] = useState(0)
  const [passwordScan, setPasswordScan] = useState(0)
  const [captchaScan, setCaptchaScan] = useState(0)
  const [pulseKey, setPulseKey] = useState(0)
  const [sessions, setSessions] = useState(2847)
  const [uptime, setUptime] = useState(99.97)
  const [counterFlash, setCounterFlash] = useState(false)
  const [buttonState, setButtonState] = useState<ButtonState>('default')
  const [loadingFrame, setLoadingFrame] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; symbol: string }>>([])
  const [successBurst, setSuccessBurst] = useState(false)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Session counter — slot-machine style
  useEffect(() => {
    const id = window.setInterval(() => {
      setSessions((prev) => prev + randomInt(-8, 14))
      setUptime(() => Number((99.9 + Math.random() * 0.09).toFixed(2)))
      setCounterFlash(true)
      window.setTimeout(() => setCounterFlash(false), 400)
    }, 3500 + Math.random() * 1500)

    return () => window.clearInterval(id)
  }, [])

  // Entry animation (runs when isVisible becomes true)
  const hasAnimated = useRef(false)
  useEffect(() => {
    if (!isVisible) {
      hasAnimated.current = false
      return
    }
    if (hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline()
    const logo = cardRef.current?.querySelector('.login-logo-wrap') as HTMLElement | null
    const card = cardRef.current
    const title = cardRef.current?.querySelector('.login-title') as HTMLElement | null
    const fields = cardRef.current?.querySelectorAll<HTMLElement>('.login-field')
    const btns = cardRef.current?.querySelectorAll<HTMLElement>('.login-submit')

    // 1. Logo
    if (logo) {
      tl.fromTo(
        logo,
        { y: -40, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
      )
    }

    // 2. Card
    if (card) {
      tl.fromTo(
        card,
        { opacity: 0, y: 24, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      )
    }

    // 3. Title — SplitType inside rAF
    requestAnimationFrame(() => {
      if (!title) return
      const split = new SplitType(title, { types: 'chars' })
      if (split?.chars?.length) {
        tl.fromTo(
          split.chars,
          { opacity: 0, y: 16, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.035, duration: 0.4, ease: 'back.out(2)' },
          '-=0.2',
        )
      }
    })

    // 4. Fields
    if (fields && fields.length > 0) {
      tl.fromTo(
        fields,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.35, ease: 'power2.out' },
        '-=0.1',
      )
    }

    // 5. Button
    if (btns && btns.length > 0) {
      tl.fromTo(
        btns,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.6)' },
      )
    }

    return () => {
      tl.kill()
    }
  }, [isVisible])

  // Loading text animation cycle
  useEffect(() => {
    if (buttonState !== 'loading') return
    const id = window.setInterval(() => {
      setLoadingFrame((f) => (f + 1) % LOADING_DOTS.length)
    }, 160)
    return () => window.clearInterval(id)
  }, [buttonState])

  // Sync button state with form status
  useEffect(() => {
    if (form.status === 'loading') {
      setButtonState('loading')
    } else if (form.status === 'success') {
      setButtonState('success')
      setSuccessBurst(true)
      const card = cardRef.current
      if (card && !reducedMotion) {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
      window.setTimeout(() => {
        onSuccess()
      }, 900)
    } else {
      setButtonState('default')
    }
  }, [form.status, onSuccess, reducedMotion])

  // Shake on errors
  useEffect(() => {
    if (reducedMotion) return
    if (form.errors.email && emailRef.current) {
      gsap.fromTo(
        emailRef.current,
        { x: -8 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' },
      )
    }
    if (form.errors.password && passwordRef.current) {
      gsap.fromTo(
        passwordRef.current,
        { x: -8 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' },
      )
    }
    if (form.errors.captcha && captchaRef.current) {
      gsap.fromTo(
        captchaRef.current,
        { x: -8 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' },
      )
    }
  }, [form.errors.email, form.errors.password, form.errors.captcha, reducedMotion])

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      if (buttonState !== 'default') return
      setPulseKey((k) => k + 1)
      await form.submit()
    },
    [form, buttonState],
  )

  const handleButtonHover = useCallback(() => {
    if (buttonState !== 'default') return
    if (reducedMotion) return

    const btn = submitRef.current
    if (!btn) return

    gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' })

    const rect = btn.getBoundingClientRect()
    const burst = Array.from({ length: 8 }).map((_, index) => {
      const angle = (index / 8) * Math.PI * 2
      return {
        id: Date.now() + index,
        x: Math.cos(angle) * (rect.width / 2 + 10),
        y: Math.sin(angle) * (rect.height / 2 + 10),
        symbol: MATH_PARTICLES[Math.floor(Math.random() * MATH_PARTICLES.length)],
      }
    })

    setParticles(burst)
    window.setTimeout(() => setParticles([]), 650)
  }, [buttonState, reducedMotion])

  const handleButtonLeave = useCallback(() => {
    const btn = submitRef.current
    if (!btn || reducedMotion) return
    gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' })
  }, [reducedMotion])

  const triggerInputFlash = useCallback(
    (field: 'email' | 'password' | 'captcha') => {
      if (field === 'email') setEmailScan((n) => n + 1)
      else if (field === 'password') setPasswordScan((n) => n + 1)
      else setCaptchaScan((n) => n + 1)
    },
    [],
  )

  const handleCreateHover = useCallback(() => {
    const link = createLinkRef.current
    if (!link || reducedMotion) return
    const words = link.querySelectorAll('.login-create-word')
    gsap.fromTo(
      words,
      { y: 0 },
      { y: -4, duration: 0.3, stagger: 0.05, ease: 'power2.out', yoyo: true, repeat: 1 },
    )
    const arrow = link.querySelector('.login-create-arrow')
    if (arrow) {
      gsap.fromTo(
        arrow,
        { x: 0 },
        { x: 4, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 },
      )
    }
  }, [reducedMotion])

  return (
    <div className="login-stage" ref={cardRef} style={{ opacity: 1 }}>
      <div className="login-logo-wrap">
        <MatekaLogo onClick={onLogoClick} ariaLabel="Voltar para a landing" />
      </div>

      <div className="login-card" style={{ opacity: 1 }}>
        <span className="scan-line" aria-hidden="true" />
        <div className="login-card-glow" aria-hidden="true" />

        <div className="login-mini-wave-wrap" aria-hidden="true">
          <MiniWaveCanvas focused={form.focused} pulseKey={pulseKey} />
        </div>

        <div className="login-header">
          <p className="login-kicker">// ACESSO.AUTENTICADO<span className="cursor-blink">_</span></p>
          <h1 className="login-title">Bem-vindo de volta.</h1>
          <p className="login-subtitle">
            Continue sua jornada matemática de onde parou.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div
            ref={emailWrapRef}
            className={`login-field ${form.errors.email ? 'is-error' : ''}`}
          >
            <div className="login-input-wrap">
              <input
                ref={emailRef}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="login-input peer"
                value={form.email}
                onChange={(event) => {
                  form.setEmail(event.target.value)
                  triggerInputFlash('email')
                  if (emailRef.current) createSymbolBurst(emailRef.current)
                }}
                onFocus={() => { form.setFocused('email'); if (emailRef.current) createSymbolBurst(emailRef.current) }}
                onBlur={() => form.setFocused(null)}
                data-login-input
                placeholder="voce@universidade.edu"
              />
              <label className="login-label" htmlFor="login-email">
                Email acadêmico
              </label>
              <span className="login-input-icon" aria-hidden="true">
                f(x)
              </span>
              <span className={`login-scan-line ${emailScan ? 'is-active' : ''}`} />
            </div>
            <span className={`login-error ${form.errors.email ? 'is-visible' : ''}`} role="alert">
              {form.errors.email}
            </span>
          </div>

          <div
            ref={passwordWrapRef}
            className={`login-field ${form.errors.password ? 'is-error' : ''}`}
          >
            <div className="login-input-wrap">
              <input
                ref={passwordRef}
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="login-input peer"
                value={form.password}
                onChange={(event) => {
                  form.setPassword(event.target.value)
                  triggerInputFlash('password')
                  if (passwordRef.current) createSymbolBurst(passwordRef.current)
                }}
                onFocus={() => { form.setFocused('password'); if (passwordRef.current) createSymbolBurst(passwordRef.current) }}
                onBlur={() => form.setFocused(null)}
                data-login-input
                placeholder="••••••••"
              />
              <label className="login-label" htmlFor="login-password">
                Senha
              </label>
              <span className="login-input-icon" aria-hidden="true">
                {form.focused === 'password' ? '∑' : '🔒'}
              </span>
              <span className={`login-scan-line ${passwordScan ? 'is-active' : ''}`} />
            </div>
            <span className={`login-error ${form.errors.password ? 'is-visible' : ''}`} role="alert">
              {form.errors.password}
            </span>
          </div>

          {form.captchaRequired ? (
            <div
              ref={captchaWrapRef}
              className={`login-field login-field-captcha ${form.errors.captcha ? 'is-error' : ''}`}
            >
              <label className="login-label-static" htmlFor="login-captcha">
                Prove que você é humano
              </label>
              <div className="login-captcha-question">
                ∫₀^π sin(x) dx = ?
              </div>
              <div className="login-input-wrap">
                <input
                  ref={captchaRef}
                  id="login-captcha"
                  name="captcha"
                  type="text"
                  inputMode="decimal"
                  className="login-input"
                  value={form.captcha}
                  onChange={(event) => {
                    form.setCaptcha(event.target.value)
                    triggerInputFlash('captcha')
                  }}
                  onFocus={() => form.setFocused('captcha')}
                  onBlur={() => form.setFocused(null)}
                  data-login-input
                  placeholder="digite o resultado"
                />
                <span className="login-input-icon" aria-hidden="true">∫</span>
                <span className={`login-scan-line ${captchaScan ? 'is-active' : ''}`} />
              </div>
              <span className={`login-error ${form.errors.captcha ? 'is-visible' : ''}`} role="alert">
                {form.errors.captcha}
              </span>
            </div>
          ) : null}

          <div className="login-row">
            <label className="login-check">
              <input type="checkbox" />
              <span className="login-check-box" aria-hidden="true" />
              <span>Manter sessão</span>
            </label>
            <button type="button" className="login-forgot" data-cursor>
              Esqueci a senha →
            </button>
          </div>

          <button
            ref={submitRef}
            type="submit"
            className={`login-submit login-submit-${buttonState}`}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            disabled={buttonState !== 'default'}
            data-cursor
          >
            <span ref={submitLabelRef} className="login-submit-label">
              {buttonState === 'default' && 'Entrar no Matéka!'}
              {buttonState === 'loading' && LOADING_DOTS[loadingFrame]}
              {buttonState === 'success' && '✓ Bem-vindo!'}
            </span>
            <span className="login-submit-shimmer" aria-hidden="true" />
            {buttonState === 'loading' ? (
              <span className="login-submit-ring" aria-hidden="true" />
            ) : null}
            {particles.map((particle) => (
              <span
                key={particle.id}
                className="login-particle"
                style={{
                  transform: `translate(${particle.x}px, ${particle.y}px)`,
                }}
              >
                {particle.symbol}
              </span>
            ))}
            {successBurst ? (
              <span className="login-success-burst" aria-hidden="true">
                {['∫', '∑', 'π', '√', '∞', 'Δ', '∂', 'φ', '⊕', '⊗', '∇', '≈'].map((sym, idx) => (
                  <span
                    key={idx}
                    className="login-success-particle"
                    style={{
                      transform: `rotate(${idx * 30}deg) translateY(-80px)`,
                    }}
                  >
                    {sym}
                  </span>
                ))}
              </span>
            ) : null}
          </button>

          <div className={`login-counter ${counterFlash ? 'is-flashing' : ''}`} aria-live="polite">
            {formatCounter(sessions, uptime)}
          </div>
        </form>
      </div>

      <button
        ref={createLinkRef}
        type="button"
        className="login-create"
        onClick={onCreateAccount}
        onMouseEnter={handleCreateHover}
        data-cursor
      >
        <span className="login-create-text">
          <span className="login-create-word">Ainda</span>{' '}
          <span className="login-create-word">não</span>{' '}
          <span className="login-create-word">tem</span>{' '}
          <span className="login-create-word">conta?</span>
        </span>
        <span className="login-create-cta">
          <span className="login-create-arrow">→</span>
          <span className="login-create-word">Começar agora</span>
        </span>
      </button>
    </div>
  )
}

export default LoginCard
