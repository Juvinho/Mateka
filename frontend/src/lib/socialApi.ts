export type PublicUser = {
  id: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string | null
  role: string
  createdAt: string
}

export type Relationship = 'self' | 'none' | 'friends' | 'pending_sent' | 'pending_received'

async function parseJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message ?? 'Não foi possível completar a operação.')
  }
  return body as T
}

export async function searchUsers(query: string): Promise<PublicUser[]> {
  const response = await fetch(`/api/social/users/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  })
  const body = await parseJson<{ users: PublicUser[] }>(response)
  return body.users
}

export async function getPublicProfile(userId: string): Promise<{ user: PublicUser; relationship: Relationship }> {
  const response = await fetch(`/api/social/users/${userId}`, { credentials: 'include' })
  return parseJson(response)
}

export async function sendFriendRequest(userId: string): Promise<Relationship> {
  const response = await fetch(`/api/social/friends/${userId}/request`, { method: 'POST', credentials: 'include' })
  const body = await parseJson<{ relationship: Relationship }>(response)
  return body.relationship
}

export async function acceptFriendRequest(userId: string): Promise<Relationship> {
  const response = await fetch(`/api/social/friends/${userId}/accept`, { method: 'POST', credentials: 'include' })
  const body = await parseJson<{ relationship: Relationship }>(response)
  return body.relationship
}

export async function removeRelationship(userId: string): Promise<Relationship> {
  const response = await fetch(`/api/social/friends/${userId}`, { method: 'DELETE', credentials: 'include' })
  const body = await parseJson<{ relationship: Relationship }>(response)
  return body.relationship
}

export async function listFriends(): Promise<PublicUser[]> {
  const response = await fetch('/api/social/friends', { credentials: 'include' })
  const body = await parseJson<{ friends: PublicUser[] }>(response)
  return body.friends
}

export async function listFriendRequests(): Promise<{ received: PublicUser[]; sent: PublicUser[] }> {
  const response = await fetch('/api/social/friends/requests', { credentials: 'include' })
  return parseJson(response)
}

// People who accepted a friend request I sent, that I haven't seen yet —
// drives the notification badge on the "Amigos" button.
export async function listAcceptedUnseen(): Promise<PublicUser[]> {
  const response = await fetch('/api/social/friends/accepted-unseen', { credentials: 'include' })
  const body = await parseJson<{ users: PublicUser[] }>(response)
  return body.users
}

export async function markAcceptedSeen(): Promise<void> {
  const response = await fetch('/api/social/friends/accepted-unseen/seen', { method: 'POST', credentials: 'include' })
  await parseJson(response)
}
