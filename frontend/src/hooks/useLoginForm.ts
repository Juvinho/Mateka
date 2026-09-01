import { useCallback, useState } from 'react'
import { useAuth } from '../state/useAuth'

export type LoginStatus = 'idle' | 'loading' | 'success'
export type FocusedField = 'email' | 'password' | 'captcha' | null

type CaptchaChallenge = { question: string; answer: number; tolerance: number }

const CAPTCHA_CHALLENGES: CaptchaChallenge[] = [
  { question: '∫₀^π sin(x) dx', answer: 2, tolerance: 0.01 },
  { question: 'd/dx[x³] em x = 2', answer: 12, tolerance: 0.01 },
  { question: 'log₂(32)', answer: 5, tolerance: 0.01 },
  { question: '∑(i=1 até 5) i', answer: 15, tolerance: 0.01 },
  { question: '√169', answer: 13, tolerance: 0.01 },
  { question: '2⁴ − 3²', answer: 7, tolerance: 0.01 },
  { question: '∫₀^2 x dx', answer: 2, tolerance: 0.01 },
  { question: 'lim(x→∞) 1/x', answer: 0, tolerance: 0.01 },
  { question: 'sen²(π/6) + cos²(π/6)', answer: 1, tolerance: 0.01 },
  { question: 'e⁰', answer: 1, tolerance: 0.01 },
]

export type LoginErrors = {
  email?: string
  password?: string
  captcha?: string
  form?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ValidateResult = {
  valid: boolean
  errors: LoginErrors
}

const validate = (email: string, password: string): ValidateResult => {
  const errors: LoginErrors = {}

  if (!email.trim()) {
    errors.email = 'Informe seu email'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'Email inválido — verifique o formato'
  }

  if (!password) {
    errors.password = 'Informe sua senha'
  } else if (password.length < 4) {
    errors.password = 'Senha precisa ter pelo menos 4 caracteres'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

type UseLoginFormReturn = {
  email: string
  password: string
  captcha: string
  errors: LoginErrors
  status: LoginStatus
  focused: FocusedField
  attempts: number
  captchaRequired: boolean
  captchaQuestion: string
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setCaptcha: (value: string) => void
  setFocused: (field: FocusedField) => void
  submit: () => Promise<boolean>
  resetStatus: () => void
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { refresh } = useAuth()
  const [email, setEmailState] = useState('')
  const [password, setPasswordState] = useState('')
  const [captcha, setCaptchaState] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [focused, setFocused] = useState<FocusedField>(null)
  const [attempts, setAttempts] = useState(0)
  const [challengeIndex] = useState(() => Math.floor(Math.random() * CAPTCHA_CHALLENGES.length))

  const captchaRequired = attempts >= 2
  const captchaQuestion = CAPTCHA_CHALLENGES[challengeIndex]!.question

  const setEmail = useCallback((value: string) => {
    setEmailState(value)
    setErrors((prev) => ({ ...prev, email: undefined }))
  }, [])

  const setPassword = useCallback((value: string) => {
    setPasswordState(value)
    setErrors((prev) => ({ ...prev, password: undefined }))
  }, [])

  const setCaptcha = useCallback((value: string) => {
    setCaptchaState(value)
    setErrors((prev) => ({ ...prev, captcha: undefined }))
  }, [])

  const submit = useCallback(async (): Promise<boolean> => {
    const { valid, errors: nextErrors } = validate(email, password)

    if (captchaRequired) {
      const challenge = CAPTCHA_CHALLENGES[challengeIndex]!
      const numeric = Number(captcha.replace(',', '.'))
      if (!captcha.trim()) {
        nextErrors.captcha = 'Resolva o desafio para continuar'
      } else if (!Number.isFinite(numeric) || Math.abs(numeric - challenge.answer) > challenge.tolerance) {
        nextErrors.captcha = 'Tente novamente, estudante 📐'
      }
    }

    if (!valid || nextErrors.captcha) {
      setErrors(nextErrors)
      if (!valid) {
        setAttempts((n) => n + 1)
      }
      return false
    }

    setErrors({})
    setStatus('loading')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setErrors({ password: body?.message ?? 'Não foi possível entrar. Tente novamente.' })
        setStatus('idle')
        setAttempts((n) => n + 1)
        return false
      }

      // Refresh the shared auth context before declaring success — otherwise
      // the redirect that follows fires while the context still thinks
      // there's no session, and a gated destination bounces right back.
      await refresh()
      setStatus('success')
      return true
    } catch {
      setErrors({ form: 'Não foi possível conectar ao servidor. Tente novamente.' })
      setStatus('idle')
      return false
    }
  }, [email, password, captcha, captchaRequired, refresh])

  const resetStatus = useCallback(() => {
    setStatus('idle')
  }, [])

  return {
    email,
    password,
    captcha,
    errors,
    status,
    focused,
    attempts,
    captchaRequired,
    captchaQuestion,
    setEmail,
    setPassword,
    setCaptcha,
    setFocused,
    submit,
    resetStatus,
  }
}
