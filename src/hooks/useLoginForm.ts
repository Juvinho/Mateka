import { useCallback, useState } from 'react'

export type LoginStatus = 'idle' | 'loading' | 'success'
export type FocusedField = 'email' | 'password' | 'captcha' | null

export type LoginErrors = {
  email?: string
  password?: string
  captcha?: string
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
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setCaptcha: (value: string) => void
  setFocused: (field: FocusedField) => void
  submit: () => Promise<boolean>
  resetStatus: () => void
}

export const useLoginForm = (): UseLoginFormReturn => {
  const [email, setEmailState] = useState('')
  const [password, setPasswordState] = useState('')
  const [captcha, setCaptchaState] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [focused, setFocused] = useState<FocusedField>(null)
  const [attempts, setAttempts] = useState(0)

  const captchaRequired = attempts >= 2

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
      const numeric = Number(captcha.replace(',', '.'))
      if (!captcha.trim()) {
        nextErrors.captcha = 'Resolva o desafio para continuar'
      } else if (!Number.isFinite(numeric) || Math.abs(numeric - 2) > 0.01) {
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

    await new Promise((resolve) => setTimeout(resolve, 1400))

    setStatus('success')
    return true
  }, [email, password, captcha, captchaRequired])

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
    setEmail,
    setPassword,
    setCaptcha,
    setFocused,
    submit,
    resetStatus,
  }
}
