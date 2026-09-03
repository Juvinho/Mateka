import { useCallback, useEffect, useRef, useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import ModulePickerModal from '../components/profile/ModulePickerModal'
import ModuleProgressCard from '../components/profile/ModuleProgressCard'
import FriendsModal from '../components/social/FriendsModal'
import { listAcceptedUnseen, listFriendRequests } from '../lib/socialApi'
import { useAuth } from '../state/useAuth'
import { useAggregatedProgress } from '../hooks/useAggregatedProgress'
import { resizeImageToBlob } from '../lib/imageResize'
import { uploadAvatar, uploadBanner, deleteAvatar, deleteBanner, updateBio } from '../lib/profileApi'
import { initialsFor } from '../lib/initials'

const BIO_MAX_LENGTH = 240

type Props = {
  onNavigate: (hash: string) => void
}

const PerfilPage = ({ onNavigate }: Props) => {
  const { user, logout, refresh } = useAuth()
  const {
    totalPoints,
    combinedAccuracy,
    bestStreak,
    progressByModuleId,
    allModules,
    startedModules,
    achievements,
  } = useAggregatedProgress()
  const bio = user?.bio ?? ''

  const [pickerOpen, setPickerOpen] = useState(false)
  const [friendsTab, setFriendsTab] = useState<'amigos' | 'buscar' | null>(null)
  const [hasNotification, setHasNotification] = useState(false)

  // Lit up by either a friend request someone just sent me, or someone
  // accepting a request I sent — re-checked on a light poll (not a real
  // subscription) so it also catches up without a manual reload.
  const checkNotifications = useCallback(() => {
    return Promise.all([listAcceptedUnseen(), listFriendRequests()])
      .then(([accepted, requests]) => {
        setHasNotification(accepted.length > 0 || requests.received.length > 0)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    const tick = () => { if (!cancelled) checkNotifications() }
    tick()
    const interval = setInterval(tick, 20000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [checkNotifications])
  const [imageError, setImageError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bioEditing, setBioEditing] = useState(false)
  const [bioDraft, setBioDraft] = useState('')
  const [bioSaving, setBioSaving] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const bannerInputRef = useRef<HTMLInputElement | null>(null)

  const avatar = user?.avatarUrl ?? null
  const banner = user?.bannerUrl ?? null

  const initials = initialsFor(user?.displayName)
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const handleLogout = () => {
    void logout().then(() => onNavigate('#hero'))
  }

  const startEditingBio = () => {
    setBioDraft(bio)
    setBioEditing(true)
  }

  const saveBio = async () => {
    setImageError(null)
    setBioSaving(true)
    try {
      await updateBio(bioDraft.trim())
      await refresh()
      setBioEditing(false)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Não foi possível salvar a bio.')
    } finally {
      setBioSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImageError(null)
    setAvatarUploading(true)
    try {
      const blob = await resizeImageToBlob(file, 320)
      await uploadAvatar(blob)
      await refresh()
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Não foi possível carregar essa imagem.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImageError(null)
    setBannerUploading(true)
    try {
      const blob = await resizeImageToBlob(file, 1400, 0.78)
      await uploadBanner(blob)
      await refresh()
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Não foi possível carregar essa imagem.')
    } finally {
      setBannerUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setImageError(null)
    setAvatarUploading(true)
    try {
      await deleteAvatar()
      await refresh()
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Não foi possível remover a foto.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleRemoveBanner = async () => {
    setImageError(null)
    setBannerUploading(true)
    try {
      await deleteBanner()
      await refresh()
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Não foi possível remover o banner.')
    } finally {
      setBannerUploading(false)
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
            <span className="modulos-breadcrumb-current">Meu Perfil</span>
          </nav>

          <div className="modulos-streak-badge" aria-label={`Streak de ${bestStreak} dias`}>
            🔥 {bestStreak} dias
          </div>

          <ProfileDropdown initials={initials} />
        </div>
      </header>

      <div
        className="perfil-banner"
        style={banner ? { backgroundImage: `url(${banner})` } : undefined}
      >
        <div className="perfil-banner__actions">
          {banner ? (
            <button type="button" className="perfil-banner__remove" onClick={handleRemoveBanner} disabled={bannerUploading}>
              Remover
            </button>
          ) : null}
          <button
            type="button"
            className="perfil-banner__edit"
            onClick={() => bannerInputRef.current?.click()}
            disabled={bannerUploading}
          >
            🖼️ {bannerUploading ? 'Enviando...' : banner ? 'Trocar banner' : 'Adicionar banner'}
          </button>
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleBannerChange}
        />
      </div>

      <main className="perfil-shell">
        <div className="perfil-summary">
          <div className="perfil-avatar-wrap">
            <div
              className="perfil-avatar"
              style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
            >
              {avatar ? null : initials}
            </div>
            <button
              type="button"
              className="perfil-avatar__edit"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Trocar foto de perfil"
              disabled={avatarUploading}
            >
              {avatarUploading ? '…' : '📷'}
            </button>
            {avatar && !avatarUploading ? (
              <button
                type="button"
                className="perfil-avatar__remove"
                onClick={handleRemoveAvatar}
                aria-label="Remover foto de perfil"
              >
                ×
              </button>
            ) : null}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>
          <div className="perfil-summary__info">
            <h1>
              {user?.displayName ?? 'Estudante'}
              {user?.role === 'creator' ? (
                <span className="creator-badge" title="Criador do Mateka!">
                  ✦ Criador do Mateka!
                </span>
              ) : null}
            </h1>
            <p className="perfil-summary__email">{user?.email}</p>
            {memberSince ? <p className="perfil-summary__meta">Aluno desde {memberSince}</p> : null}
            {user?.institution ? <p className="perfil-summary__meta">{user.institution}</p> : null}
          </div>
          <button type="button" className="btn-secondary perfil-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>

        {imageError ? <p className="perfil-image-error" role="alert">{imageError}</p> : null}

        <div className="perfil-bio">
          {bioEditing ? (
            <>
              <textarea
                className="perfil-bio__textarea"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value.slice(0, BIO_MAX_LENGTH))}
                placeholder="Conte um pouco sobre você..."
                maxLength={BIO_MAX_LENGTH}
                rows={2}
                autoFocus
              />
              <div className="perfil-bio__actions">
                <span className="perfil-bio__counter">{bioDraft.length}/{BIO_MAX_LENGTH}</span>
                <button type="button" className="btn-secondary" onClick={() => setBioEditing(false)} disabled={bioSaving}>
                  Cancelar
                </button>
                <button type="button" className="btn-primary" onClick={() => void saveBio()} disabled={bioSaving}>
                  {bioSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </>
          ) : (
            <button type="button" className="perfil-bio__display" onClick={startEditingBio}>
              {bio ? bio : <span className="perfil-bio__placeholder">+ Adicionar uma bio</span>}
            </button>
          )}
        </div>

        <div className="perfil-stats-row" role="group" aria-label="Desempenho geral">
          <div className="perfil-stat-tile">
            <span className="perfil-stat-tile__value">{totalPoints}</span>
            <span className="perfil-stat-tile__label">pontos totais</span>
          </div>
          <div className="perfil-stat-tile">
            <span className="perfil-stat-tile__value">{Math.round(combinedAccuracy * 100)}%</span>
            <span className="perfil-stat-tile__label">precisão média</span>
          </div>
          <div className="perfil-stat-tile">
            <span className="perfil-stat-tile__value">🔥 {bestStreak}</span>
            <span className="perfil-stat-tile__label">dias de sequência</span>
          </div>
        </div>

        <div className="perfil-header">
          <p className="section-kicker">
            Conquistas — {achievements.filter((a) => a.unlocked).length}/{achievements.length}
          </p>
        </div>

        <div className="perfil-achievements-grid">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`perfil-achievement${a.unlocked ? ' is-unlocked' : ''}`}
              title={a.description}
            >
              <span className="perfil-achievement__icon" aria-hidden="true">{a.unlocked ? a.icon : '🔒'}</span>
              <span className="perfil-achievement__title">{a.title}</span>
            </div>
          ))}
        </div>

        <div className="perfil-header">
          <div>
            <p className="section-kicker">Seus módulos</p>
            <h2>Continue de onde parou.</h2>
          </div>
          <div className="perfil-header__actions">
            <button type="button" className="btn-secondary perfil-friends-btn" onClick={() => setFriendsTab('amigos')}>
              Amigos →
              {hasNotification ? <span className="perfil-friends-btn__dot" aria-label="Novidades em Amigos" /> : null}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setPickerOpen(true)}>
              Acessar outros módulos
            </button>
          </div>
        </div>

        {startedModules.length > 0 ? (
          <div className="perfil-modules-grid">
            {startedModules.map((m) => (
              <ModuleProgressCard
                key={m.config.moduleId}
                config={m.config}
                hash={m.hash}
                state={progressByModuleId[m.config.moduleId as keyof typeof progressByModuleId].state}
                averageAccuracy={progressByModuleId[m.config.moduleId as keyof typeof progressByModuleId].averageAccuracy}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="perfil-empty-state">
            <p>Você ainda não começou nenhum módulo.</p>
            <button type="button" className="btn-primary" onClick={() => setPickerOpen(true)}>
              Escolher meu primeiro módulo →
            </button>
          </div>
        )}
      </main>

      {pickerOpen ? (
        <ModulePickerModal
          modules={allModules}
          onSelect={(hash) => {
            setPickerOpen(false)
            onNavigate(hash)
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}

      {friendsTab ? (
        <FriendsModal
          initialTab={friendsTab}
          onNavigate={onNavigate}
          onClose={() => { setFriendsTab(null); void checkNotifications() }}
          onAcceptedSeen={checkNotifications}
        />
      ) : null}
    </div>
  )
}

export default PerfilPage
