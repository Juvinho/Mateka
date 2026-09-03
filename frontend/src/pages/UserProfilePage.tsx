import { useEffect, useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import { initialsFor } from '../lib/initials'
import { getPublicProfile, sendFriendRequest, acceptFriendRequest, removeRelationship, blockUser } from '../lib/socialApi'
import type { PublicUser, Relationship } from '../lib/socialApi'

type Props = {
  userId: string
  onNavigate: (hash: string) => void
}

type LoadState = 'loading' | 'ready' | 'not-found'

const UserProfilePage = ({ userId, onNavigate }: Props) => {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null)
  const [relationship, setRelationship] = useState<Relationship>('none')
  const [actionPending, setActionPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // App.tsx keys this component by userId, so a navigation to a different
  // profile remounts it fresh — no need to manually reset state here first.
  useEffect(() => {
    let cancelled = false

    getPublicProfile(userId)
      .then((result) => {
        if (cancelled) return
        setProfileUser(result.user)
        setRelationship(result.relationship)
        setLoadState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setLoadState('not-found')
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const memberSince = profileUser
    ? new Date(profileUser.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null
  const initials = initialsFor(profileUser?.displayName)

  const runAction = async (action: () => Promise<Relationship>) => {
    setActionError(null)
    setActionPending(true)
    try {
      setRelationship(await action())
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível completar a ação.')
    } finally {
      setActionPending(false)
    }
  }

  return (
    <div className="perfil-page">
      <header className="modulos-header">
        <div className="modulos-header-inner">
          <MatekaLogo onClick={() => onNavigate('#hero')} ariaLabel="Ir para o início" />
          <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
            <span>Dashboard</span>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="modulos-breadcrumb-current">{profileUser?.displayName ?? 'Perfil'}</span>
          </nav>
        </div>
      </header>

      {loadState === 'loading' && <div className="lazy-loading">Carregando perfil...</div>}

      {loadState === 'not-found' && (
        <div className="perfil-user-not-found">
          <p>Não foi possível encontrar esse usuário.</p>
          <button type="button" className="btn-secondary" onClick={() => onNavigate('#perfil')}>
            Voltar para o perfil
          </button>
        </div>
      )}

      {loadState === 'ready' && profileUser && (
        <>
          <div
            className="perfil-banner"
            style={profileUser.bannerUrl ? { backgroundImage: `url(${profileUser.bannerUrl})` } : undefined}
          />

          <main className="perfil-shell">
            <div className="perfil-summary">
              <div className="perfil-avatar-wrap">
                <div
                  className="perfil-avatar"
                  style={profileUser.avatarUrl ? { backgroundImage: `url(${profileUser.avatarUrl})` } : undefined}
                >
                  {profileUser.avatarUrl ? null : initials}
                </div>
              </div>
              <div className="perfil-summary__info">
                <h1>
                  {profileUser.displayName}
                  {profileUser.role === 'creator' ? (
                    <span className="creator-badge" title="Criador do Mateka!">
                      ✦ Criador do Mateka!
                    </span>
                  ) : null}
                </h1>
                {memberSince ? <p className="perfil-summary__meta">Aluno desde {memberSince}</p> : null}
              </div>

              {relationship === 'self' ? (
                <button type="button" className="btn-secondary" onClick={() => onNavigate('#perfil')}>
                  Ir para meu perfil
                </button>
              ) : relationship === 'blocked_by' ? null : (
                <div className="user-profile-friend-actions">
                  {relationship === 'none' && (
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={actionPending}
                      onClick={() => void runAction(() => sendFriendRequest(userId))}
                    >
                      Adicionar amigo
                    </button>
                  )}
                  {relationship === 'pending_sent' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={actionPending}
                      onClick={() => void runAction(() => removeRelationship(userId))}
                    >
                      Cancelar pedido
                    </button>
                  )}
                  {relationship === 'pending_received' && (
                    <>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={actionPending}
                        onClick={() => void runAction(() => acceptFriendRequest(userId))}
                      >
                        Aceitar pedido
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={actionPending}
                        onClick={() => void runAction(() => removeRelationship(userId))}
                      >
                        Recusar
                      </button>
                    </>
                  )}
                  {relationship === 'friends' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={actionPending}
                      onClick={() => void runAction(() => removeRelationship(userId))}
                    >
                      Amigos ✓ — desfazer
                    </button>
                  )}
                  {relationship === 'blocked' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={actionPending}
                      onClick={() => void runAction(() => removeRelationship(userId))}
                    >
                      Desbloquear
                    </button>
                  )}
                  {relationship !== 'blocked' && (
                    <button
                      type="button"
                      className="btn-secondary user-profile-block-btn"
                      disabled={actionPending}
                      onClick={() => void runAction(() => blockUser(userId))}
                    >
                      Bloquear
                    </button>
                  )}
                </div>
              )}
            </div>

            {actionError ? <p className="perfil-image-error" role="alert">{actionError}</p> : null}

            <div className="perfil-bio">
              <p className="perfil-bio__display perfil-bio__display--readonly">
                {profileUser.bio ? profileUser.bio : <span className="perfil-bio__placeholder">Sem bio.</span>}
              </p>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

export default UserProfilePage
