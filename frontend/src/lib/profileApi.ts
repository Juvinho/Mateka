import type { AuthUser } from '../state/authContextStore'

async function parseUserResponse(response: Response): Promise<AuthUser> {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message ?? 'Não foi possível completar a operação.')
  }
  return body.user as AuthUser
}

async function uploadImage(kind: 'avatar' | 'banner', blob: Blob): Promise<AuthUser> {
  const formData = new FormData()
  formData.append(kind, blob, `${kind}.jpg`)

  const response = await fetch(`/api/profile/${kind}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return parseUserResponse(response)
}

async function deleteImage(kind: 'avatar' | 'banner'): Promise<AuthUser> {
  const response = await fetch(`/api/profile/${kind}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return parseUserResponse(response)
}

export const uploadAvatar = (blob: Blob) => uploadImage('avatar', blob)
export const uploadBanner = (blob: Blob) => uploadImage('banner', blob)
export const deleteAvatar = () => deleteImage('avatar')
export const deleteBanner = () => deleteImage('banner')

export async function updateBio(bio: string): Promise<AuthUser> {
  const response = await fetch('/api/profile/bio', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio }),
  })
  return parseUserResponse(response)
}

export async function deleteAccount(password: string): Promise<void> {
  const response = await fetch('/api/profile/account', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Não foi possível excluir a conta.')
  }
}
