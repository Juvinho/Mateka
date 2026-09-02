import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeRelationship,
  listFriends,
  listFriendRequests,
  listAcceptedUnseen,
  markAcceptedSeen,
} from '../../lib/socialApi'
import type { PublicUser } from '../../lib/socialApi'
import { FriendAvatar, FriendCard } from './FriendAvatar'

type Tab = 'amigos' | 'buscar'

type Props = {
  onNavigate: (hash: string) => void
  onClose: () => void
  initialTab?: Tab
  onAcceptedSeen?: () => void
}

const FriendsModal = ({ onNavigate, onClose, initialTab = 'amigos', onAcceptedSeen }: Props) => {
  const [tab, setTab] = useState<Tab>(initialTab)

  const [friends, setFriends] = useState<PublicUser[]>([])
  const [received, setReceived] = useState<PublicUser[]>([])
  const [sent, setSent] = useState<PublicUser[]>([])
  const [loaded, setLoaded] = useState(false)
  const [busyIds, setBusyIds] = useState<Record<string, true>>({})
  const [error, setError] = useState<string | null>(null)
  const [acceptedUnseen, setAcceptedUnseen] = useState<PublicUser[]>([])

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PublicUser[]>([])
  const [searching, setSearching] = useState(false)
  const [sentIds, setSentIds] = useState<Record<string, true>>({})

  const loadFriendsAndRequests = () =>
    Promise.all([listFriends(), listFriendRequests()]).then(([friendsList, requests]) => {
      setFriends(friendsList)
      setReceived(requests.received)
      setSent(requests.sent)
    })

  useEffect(() => {
    let cancelled = false
    loadFriendsAndRequests()
      .catch(() => { if (!cancelled) setError('Não foi possível carregar seus amigos.') })
      .finally(() => { if (!cancelled) setLoaded(true) })
    return () => { cancelled = true }
  }, [])

  // Show "fulano aceitou seu pedido" once, then mark it seen server-side so
  // the notification dot on the "Amigos" button clears — same "seen when
  // opened" semantics as a typical notification bell.
  useEffect(() => {
    let cancelled = false
    listAcceptedUnseen()
      .then((users) => {
        if (cancelled || users.length === 0) return
        setAcceptedUnseen(users)
        return markAcceptedSeen().then(() => {
          if (!cancelled) onAcceptedSeen?.()
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [onAcceptedSeen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const withBusy = async (id: string, action: () => Promise<unknown>) => {
    setError(null)
    setBusyIds((prev) => ({ ...prev, [id]: true }))
    try {
      await action()
      await loadFriendsAndRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível completar a ação.')
    } finally {
      setBusyIds((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const trimmedQuery = query.trim()
  // Below the 2-char threshold there's nothing to fetch, so both derive from
  // render instead of being reset via effect — avoids a synchronous setState
  // in the effect body for a case that isn't async, and stays correct even
  // if the query shrinks back below 2 chars while a debounced fetch is
  // in-flight (its cleanup cancels the fetch but can't un-set `searching`).
  const displayedResults = trimmedQuery.length >= 2 ? results : []
  const effectiveSearching = searching && trimmedQuery.length >= 2

  useEffect(() => {
    if (trimmedQuery.length < 2) return
    let cancelled = false
    // setSearching(true) has to reach state through a promise callback (not
    // as a direct statement here) — same reasoning as the fetch below.
    Promise.resolve().then(() => { if (!cancelled) setSearching(true) })
    const timeout = setTimeout(() => {
      searchUsers(trimmedQuery)
        .then((users) => {
          if (!cancelled) setResults(users)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setSearching(false)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [trimmedQuery])

  const handleAdd = async (user: PublicUser) => {
    setError(null)
    setBusyIds((prev) => ({ ...prev, [user.id]: true }))
    try {
      await sendFriendRequest(user.id)
      setSentIds((prev) => ({ ...prev, [user.id]: true }))
      await loadFriendsAndRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o pedido.')
    } finally {
      setBusyIds((prev) => {
        const next = { ...prev }
        delete next[user.id]
        return next
      })
    }
  }

  const navigateAndClose = (hash: string) => {
    onClose()
    onNavigate(hash)
  }

  return createPortal(
    <div className="module-picker-backdrop" onClick={onClose}>
      <div
        className="module-picker-panel friends-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Amigos"
      >
        <div className="module-picker-header">
          <h2>Amigos</h2>
          <button type="button" className="module-picker-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="friends-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'amigos'}
            className={`friends-modal-tab${tab === 'amigos' ? ' is-active' : ''}`}
            onClick={() => setTab('amigos')}
          >
            Ver amigos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'buscar'}
            className={`friends-modal-tab${tab === 'buscar' ? ' is-active' : ''}`}
            onClick={() => setTab('buscar')}
          >
            Buscar
          </button>
        </div>

        {acceptedUnseen.length > 0 && (
          <div className="friends-accepted-banner" role="status">
            {acceptedUnseen.map((u) => (
              <p key={u.id}>🎉 <strong>{u.displayName}</strong> aceitou seu pedido de amizade!</p>
            ))}
          </div>
        )}

        <div className="friends-modal-scroll">
          {error ? <p className="perfil-image-error friends-modal-error" role="alert">{error}</p> : null}

          {tab === 'amigos' ? (
            <div className="friends-modal-body">
              {received.length > 0 && (
                <section className="friends-section">
                  <p className="section-kicker">Pedidos recebidos</p>
                  <div className="friends-grid">
                    {received.map((u) => (
                      <div key={u.id} className="friends-request-card">
                        <FriendAvatar user={u} onNavigate={navigateAndClose} />
                        <div className="friends-request-card__actions">
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={Boolean(busyIds[u.id])}
                            onClick={() => void withBusy(u.id, () => acceptFriendRequest(u.id))}
                          >
                            Aceitar
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled={Boolean(busyIds[u.id])}
                            onClick={() => void withBusy(u.id, () => removeRelationship(u.id))}
                          >
                            Recusar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sent.length > 0 && (
                <section className="friends-section">
                  <p className="section-kicker">Pedidos enviados</p>
                  <div className="friends-grid">
                    {sent.map((u) => (
                      <FriendCard
                        key={u.id}
                        user={u}
                        onNavigate={navigateAndClose}
                        actionLabel="Cancelar"
                        busy={Boolean(busyIds[u.id])}
                        onAction={() => void withBusy(u.id, () => removeRelationship(u.id))}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section className="friends-section">
                <p className="section-kicker">Meus amigos — {friends.length}</p>
                {loaded && friends.length === 0 ? (
                  <p className="friends-search__hint">Você ainda não tem amigos. Clique em "Buscar" para encontrar alguém!</p>
                ) : (
                  <div className="friends-grid">
                    {friends.map((u) => (
                      <FriendAvatar key={u.id} user={u} onNavigate={navigateAndClose} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="friends-modal-body">
              <input
                type="text"
                className="friends-search__input"
                placeholder="Buscar pelo nome..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {effectiveSearching && <p className="friends-search__hint">Buscando...</p>}
              {!effectiveSearching && trimmedQuery.length >= 2 && displayedResults.length === 0 && (
                <p className="friends-search__hint">Nenhum usuário encontrado.</p>
              )}
              {trimmedQuery.length < 2 && (
                <p className="friends-search__hint">Digite ao menos 2 letras para buscar.</p>
              )}
              {displayedResults.length > 0 && (
                <div className="friends-grid">
                  {displayedResults.map((u) => (
                    <FriendCard
                      key={u.id}
                      user={u}
                      onNavigate={navigateAndClose}
                      actionLabel={sentIds[u.id] ? 'Enviado ✓' : 'Adicionar'}
                      busy={Boolean(busyIds[u.id])}
                      disabled={Boolean(sentIds[u.id])}
                      onAction={() => void handleAdd(u)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default FriendsModal
