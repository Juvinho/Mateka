import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '../state/useAuth'

export interface RegisterForm {
  name: string
  email: string
  institution: string
  password: string
  confirmPassword: string
}

export interface RegisterErrors {
  name?: string
  email?: string
  institution?: string
  password?: string
  confirmPassword?: string
  form?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useRegisterForm = () => {
  const { refresh } = useAuth()
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    institution: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<RegisterErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const passwordStrength = useMemo(() => {
    let score = 0
    const p = form.password || ''
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }, [form.password])

  const handleChange = useCallback((field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): { valid: boolean; errors: RegisterErrors } => {
    const out: RegisterErrors = {}
    if (!form.name.trim()) out.name = 'Informe seu nome'
    else if (form.name.trim().length < 3) out.name = 'Nome precisa ter ao menos 3 caracteres'

    if (!form.email.trim()) out.email = 'Informe seu email'
    else if (!EMAIL_RE.test(form.email.trim())) out.email = 'Email inválido — verifique o formato'

    if (!form.institution.trim()) out.institution = 'Informe sua instituição'

    if (!form.password) out.password = 'Informe uma senha'
    else if (form.password.length < 8) out.password = 'Senha precisa ter pelo menos 8 caracteres'

    if (form.confirmPassword !== form.password) out.confirmPassword = 'As senhas não conferem'

    return { valid: Object.keys(out).length === 0, errors: out }
  }, [form])

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const { valid, errors: next } = validate()
    if (!valid) {
      setErrors(next)
      return false
    }

    setErrors({})
    setStatus('loading')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const field = body?.field as keyof RegisterErrors | undefined
        setErrors(field ? { [field]: body.message } : { form: body?.message ?? 'Não foi possível criar a conta.' })
        setStatus('idle')
        return false
      }

      // Same reasoning as useLoginForm: refresh the shared auth context
      // before declaring success, so a redirect right after doesn't bounce
      // off the gate for still looking like a guest.
      await refresh()
      setStatus('success')
      return true
    } catch {
      setErrors({ form: 'Não foi possível conectar ao servidor. Tente novamente.' })
      setStatus('idle')
      return false
    }
  }, [validate, form, refresh])

  const reset = useCallback(() => {
    setStatus('idle')
    setForm({ name: '', email: '', institution: '', password: '', confirmPassword: '' })
    setErrors({})
  }, [])

  return {
    form,
    errors,
    passwordStrength,
    handleChange,
    handleSubmit,
    reset,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
  }
}

export default useRegisterForm
