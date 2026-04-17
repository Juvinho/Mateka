import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

import MatekaLogo from '../components/MatekaLogo'
import MiniWaveCanvas from '../components/MiniWaveCanvas'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { createSymbolBurst } from '../utils/particles'

type RegisterPageProps = {
  onSuccess?: () => void
  onBack?: () => void
  isVisible?: boolean
}

const RegisterPage = ({ onSuccess, onBack, isVisible }: RegisterPageProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const institutionRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const confirmRef = useRef<HTMLInputElement | null>(null)
  const submitRef = useRef<HTMLButtonElement | null>(null)

  const form = useRegisterForm()

  const nameIconRef = useRef<HTMLSpanElement | null>(null)
  const emailIconRef = useRef<HTMLSpanElement | null>(null)
  const instIconRef = useRef<HTMLSpanElement | null>(null)
  const passwordIconRef = useRef<HTMLButtonElement | null>(null)
  const confirmIconRef = useRef<HTMLSpanElement | null>(null)

  const [pulseKey, setPulseKey] = useState(0)
  const [fieldFocus, setFieldFocus] = useState<'name' | 'email' | 'institution' | 'password' | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (form.isSuccess) {
      if (!reducedMotion) {
        const el = cardRef.current
        if (el) {
          gsap.to(el, { scale: 1.02, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 })
        }
      }
      if (onSuccess) onSuccess()
    }
  }, [form.isSuccess, onSuccess, reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    // animate strength segments
    const segs = cardRef.current?.querySelectorAll<HTMLElement>('.pw-seg')
    if (!segs) return
    const active = form.passwordStrength
    segs.forEach((s, i) => {
      if (i < active) {
        gsap.to(s, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' })
      } else {
        gsap.to(s, { opacity: 0.18, scale: 0.9, duration: 0.28, ease: 'power2.out' })
      }
    })
  }, [form.passwordStrength, reducedMotion])

  // derived validation / progress
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isNameValid = form.form.name.trim().length >= 3
  const isEmailValid = EMAIL_RE.test(form.form.email.trim())
  const isInstitutionValid = form.form.institution.trim().length > 0
  const isPasswordValid = form.form.password.length >= 8
  const isConfirmValid = form.form.confirmPassword === form.form.password && isPasswordValid
  const filledFields = [form.form.name, form.form.email, form.form.institution, form.form.password, form.form.confirmPassword].filter(Boolean).length
  const progress = Math.round((filledFields / 5) * 100)
  const formReady = isNameValid && isEmailValid && isInstitutionValid && isPasswordValid && isConfirmValid

  // pulse submit button when becomes ready
  useEffect(() => {
    if (!reducedMotion && formReady && submitRef.current) {
      gsap.fromTo(submitRef.current, { opacity: 0.9, filter: 'grayscale(40%)' }, { opacity: 1, filter: 'grayscale(0%)', duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(submitRef.current, { boxShadow: '0 0 0 rgba(34,211,238,0)' }, { boxShadow: '0 0 12px rgba(34,211,238,0.45)', duration: 0.28, yoyo: true, repeat: 1 })
    }
  }, [formReady, reducedMotion])

  // icon color / micro-animation on valid
  useEffect(() => {
    if (isNameValid && nameIconRef.current && !reducedMotion) {
      gsap.fromTo(nameIconRef.current, { scale: 0.9 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 })
    }
  }, [isNameValid, reducedMotion])
  useEffect(() => {
    if (isEmailValid && emailIconRef.current && !reducedMotion) {
      gsap.fromTo(emailIconRef.current, { scale: 0.9 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 })
    }
  }, [isEmailValid, reducedMotion])
  useEffect(() => {
    if (isInstitutionValid && instIconRef.current && !reducedMotion) {
      gsap.fromTo(instIconRef.current, { scale: 0.9 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 })
    }
  }, [isInstitutionValid, reducedMotion])

  // Entry animation after flip completes (run once)
  const hasAnimated = useRef(false)
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const timeout = setTimeout(() => {
      const fields = cardRef.current?.querySelectorAll<HTMLElement>('.register-field, .login-field')
      if (!fields || fields.length === 0) return
      gsap.fromTo(
        fields,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' },
      )
    }, 750)

    return () => clearTimeout(timeout)
  }, [isVisible])
  useEffect(() => {
    if (isPasswordValid && passwordIconRef.current && !reducedMotion) {
      gsap.fromTo(passwordIconRef.current, { scale: 0.9 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 })
    }
  }, [isPasswordValid, reducedMotion])

  const handleChange = useCallback((field: string, value: string) => {
    form.handleChange(field as any, value)
  }, [form])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setPulseKey((k) => k + 1)
    const ok = await form.handleSubmit()
    if (!ok && !reducedMotion) {
      // shake invalid fields similar to login
      if (form.errors.name && nameRef.current) {
        gsap.fromTo(nameRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' })
      }
      if (form.errors.email && emailRef.current) {
        gsap.fromTo(emailRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' })
      }
      if (form.errors.password && passwordRef.current) {
        gsap.fromTo(passwordRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' })
      }
      if (form.errors.confirmPassword && confirmRef.current) {
        gsap.fromTo(confirmRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.25)' })
      }
    }
  }, [form, reducedMotion])

  return (
    <div className="login-stage register-stage" ref={cardRef}>
      <div className="login-logo-wrap">
        <MatekaLogo onClick={() => onBack?.()} ariaLabel="Voltar para login" />
      </div>

      <div className="login-card register-card">
        <div className="login-card-glow" aria-hidden="true" />

        <div className="login-mini-wave-wrap" aria-hidden="true" style={{ height: '60px', marginBottom: '16px' }}>
          <MiniWaveCanvas focused={fieldFocus as any} pulseKey={pulseKey} />
        </div>

        <div className="login-header">
          <p className="login-kicker">// NOVO.ACESSO</p>
          <h1 className="login-title">Comece sua jornada.</h1>
          <p className="login-subtitle">Junte-se a milhares de estudantes.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="register-fields-wrapper">
            <div className={`login-field ${form.errors.name ? 'is-error' : ''}`}>
              <div className="login-input-wrap">
                <input
                  ref={nameRef}
                  id="register-name"
                  name="name"
                  type="text"
                  className="login-input peer"
                  value={form.form.name}
                  onChange={(e) => { handleChange('name', e.target.value); if (nameRef.current) createSymbolBurst(nameRef.current) }}
                  onFocus={() => { setFieldFocus('name'); if (nameRef.current) createSymbolBurst(nameRef.current) }}
                  onBlur={() => setFieldFocus(null)}
                  placeholder="Como devemos te chamar?"
                />
                <label className="login-label" htmlFor="register-name">Nome completo</label>
                <span ref={nameIconRef} className="login-input-icon" aria-hidden="true" style={{ color: isNameValid ? '#22d3ee' : form.errors.name ? '#f472b6' : 'rgba(148,163,184,0.5)' }}>∇</span>
              </div>
              <span className={`login-error ${form.errors.name ? 'is-visible' : ''}`} role="alert">
                {form.errors.name}
              </span>
            </div>

            <div className={`login-field ${form.errors.email ? 'is-error' : ''}`}>
              <div className="login-input-wrap">
                <input
                  ref={emailRef}
                  id="register-email"
                  name="email"
                  type="email"
                  className="login-input peer"
                  value={form.form.email}
                  onChange={(e) => { handleChange('email', e.target.value); if (emailRef.current) createSymbolBurst(emailRef.current) }}
                  onFocus={() => { setFieldFocus('email'); if (emailRef.current) createSymbolBurst(emailRef.current) }}
                  onBlur={() => setFieldFocus(null)}
                  placeholder="seu@email.com"
                />
                <label className="login-label" htmlFor="register-email">Email</label>
                <span ref={emailIconRef} className="login-input-icon" aria-hidden="true" style={{ color: isEmailValid ? '#22d3ee' : form.errors.email ? '#f472b6' : 'rgba(148,163,184,0.5)' }}>f(x)</span>
              </div>
              <span className={`login-error ${form.errors.email ? 'is-visible' : ''}`} role="alert">
                {form.errors.email}
              </span>
            </div>

            <div className={`login-field ${form.errors.institution ? 'is-error' : ''}`}>
              <div className="login-input-wrap">
                <input
                  ref={institutionRef}
                  id="register-institution"
                  name="institution"
                  type="text"
                  className="login-input peer"
                  value={form.form.institution}
                  onChange={(e) => { handleChange('institution', e.target.value); if (institutionRef.current) createSymbolBurst(institutionRef.current) }}
                  onFocus={() => { setFieldFocus('institution'); if (institutionRef.current) createSymbolBurst(institutionRef.current) }}
                  onBlur={() => setFieldFocus(null)}
                  placeholder="Universidade, escola, cursinho..."
                />
                <label className="login-label" htmlFor="register-institution">Instituição de Ensino</label>
                <span ref={instIconRef} className="login-input-icon" aria-hidden="true" style={{ color: isInstitutionValid ? '#22d3ee' : form.errors.institution ? '#f472b6' : 'rgba(148,163,184,0.5)' }}>∫</span>
              </div>
              <span className={`login-error ${form.errors.institution ? 'is-visible' : ''}`} role="alert">
                {form.errors.institution}
              </span>
            </div>

            <div className={`login-field ${form.errors.password ? 'is-error' : ''}`}>
              <div className="login-input-wrap">
                <input
                  ref={passwordRef}
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input peer"
                  value={form.form.password}
                  onChange={(e) => { handleChange('password', e.target.value); if (passwordRef.current) createSymbolBurst(passwordRef.current) }}
                  onFocus={() => { setFieldFocus('password'); if (passwordRef.current) createSymbolBurst(passwordRef.current) }}
                  onBlur={() => setFieldFocus(null)}
                  placeholder="Mínimo 8 caracteres"
                />
                <label className="login-label" htmlFor="register-password">Senha</label>
                <button type="button" className="login-input-icon" aria-hidden="true" onClick={() => setShowPassword((s) => !s)} ref={passwordIconRef} style={{ color: isPasswordValid ? '#22d3ee' : form.errors.password ? '#f472b6' : 'rgba(148,163,184,0.5)' }}>
                  {showPassword ? '🔓' : '🔒'}
                </button>
              </div>
              <span className={`login-error ${form.errors.password ? 'is-visible' : ''}`} role="alert">
                {form.errors.password}
              </span>

              <div className="pw-strength" aria-hidden="true">
                <div className="pw-seg" style={{ background: '#f472b6', opacity: form.passwordStrength >= 1 ? 1 : 0.18 }} />
                <div className="pw-seg" style={{ background: '#fb923c', opacity: form.passwordStrength >= 2 ? 1 : 0.18 }} />
                <div className="pw-seg" style={{ background: '#facc15', opacity: form.passwordStrength >= 3 ? 1 : 0.18 }} />
                <div className="pw-seg" style={{ background: '#22d3ee', opacity: form.passwordStrength >= 4 ? 1 : 0.18 }} />
                <div className="pw-label">{['Fraca','Razoável','Boa','Forte'][Math.max(0, form.passwordStrength-1)] || 'Fraca'}</div>
              </div>
            </div>

            <div className={`login-field ${form.errors.confirmPassword ? 'is-error' : ''}`}>
              <div className="login-input-wrap">
                <input
                  ref={confirmRef}
                  id="register-confirm"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input peer"
                  value={form.form.confirmPassword}
                  onChange={(e) => { handleChange('confirmPassword', e.target.value); if (confirmRef.current) createSymbolBurst(confirmRef.current) }}
                  onFocus={() => { setFieldFocus('password'); if (confirmRef.current) createSymbolBurst(confirmRef.current) }}
                  onBlur={() => setFieldFocus(null)}
                  placeholder="Repita a senha"
                />
                <label className="login-label" htmlFor="register-confirm">Confirmar Senha</label>
                <span ref={confirmIconRef} className="login-input-icon" aria-hidden="true" style={{ color: form.form.password && form.form.password === form.form.confirmPassword ? '#22c55e' : form.errors.confirmPassword ? '#f472b6' : 'rgba(148,163,184,0.5)' }}>
                  ✓
                </span>
              </div>
              <span className={`login-error ${form.errors.confirmPassword ? 'is-visible' : ''}`} role="alert">
                {form.errors.confirmPassword}
              </span>
            </div>
          </div>

          <div className="register-progress" style={{ width: `${progress}%` }} />
          <span className="step-counter">{filledFields}/5 campos</span>

          <button
            ref={submitRef}
            type="submit"
            className={`login-submit ${form.isLoading ? 'login-submit-loading' : ''} ${form.isSuccess ? 'login-submit-success' : ''}`}
            data-cursor
            disabled={!formReady || form.isLoading}
            aria-disabled={!formReady || form.isLoading}
          >
            <span className="login-submit-label">
              {form.isLoading ? '∫ criando...' : form.isSuccess ? '✓ Conta criada!' : 'Criar minha conta'}
            </span>
            <span className="login-submit-shimmer" aria-hidden="true" />
          </button>

          <div className="login-row">
            <span />
            <button type="button" className="login-forgot" onClick={() => onBack?.()} data-cursor>
              Já tem conta? → Entrar agora
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
