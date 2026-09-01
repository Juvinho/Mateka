import { useMemo, useRef, useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ModulePickerModal from '../components/profile/ModulePickerModal'
import type { ModuleOption } from '../components/profile/ModulePickerModal'
import { useAuth } from '../state/useAuth'
import { useModuleProgress } from '../state/useModuleProgress'
import type { ModuleProgressState } from '../state/useModuleProgress'
import { useProfileBio } from '../hooks/useProfileBio'
import { resizeImageToBlob } from '../lib/imageResize'
import { uploadAvatar, uploadBanner, deleteAvatar, deleteBanner } from '../lib/profileApi'
import { computeAchievements } from '../data/achievements'
import { MATRIZES_MODULE_CONFIG } from '../data/matrizes/moduleConfig'
import { BASICOS_MODULE_CONFIG } from '../data/basicos/moduleConfig'
import type { ModuleConfig } from './ModulosPage'

const BIO_MAX_LENGTH = 240

type Props = {
  onNavigate: (hash: string) => void
}

function initialsFor(displayName: string | undefined): string {
  const parts = displayName?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return 'U'
  const first = parts[0]![0]!
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : ''
  return (first + last).toUpperCase()
}

type ModuleCardProps = {
  config: ModuleConfig
  hash: string
  state: ModuleProgressState
  averageAccuracy: number
  onNavigate: (hash: string) => void
}

const ModuleProgressCard = ({ config, hash, state, averageAccuracy, onNavigate }: ModuleCardProps) => {
  const completedTrackNodes = config.track.filter((n) => state.completedNodeIds[n.id]).length
  const progressPct = config.track.length > 0 ? Math.round((completedTrackNodes / config.track.length) * 100) : 0
  const accuracyPct = Math.round(averageAccuracy * 100)

  return (
    <article className="perfil-module-card">
      <div className="perfil-module-card__header">
        <span className="perfil-module-card__icon" aria-hidden="true">{config.icon}</span>
        <div>
          <h3>{config.name}</h3>
          <p className="perfil-module-card__badge">{config.badge}</p>
        </div>
      </div>
      <p className="perfil-module-card__description">{config.description}</p>
      <div className="perfil-module-card__progress-row">
        <div className="perfil-module-card__progress-bar">
          <div className="perfil-module-card__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span>{progressPct}%</span>
      </div>
      <div className="perfil-module-card__stats">
        <span>{completedTrackNodes}/{config.track.length} etapas</span>
        <span>{accuracyPct}% de precisão</span>
      </div>
      <button type="button" className="btn-primary" onClick={() => onNavigate(hash)}>
        Continuar →
      </button>
    </article>
  )
}

const PerfilPage = ({ onNavigate }: Props) => {
  const { user, logout, refresh } = useAuth()
  const basicosProgress = useModuleProgress('conceitos-basicos')
  const matrizesProgress = useModuleProgress('matrizes')
  const { bio, setBio } = useProfileBio(user?.id)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bioEditing, setBioEditing] = useState(false)
  const [bioDraft, setBioDraft] = useState('')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const bannerInputRef = useRef<HTMLInputElement | null>(null)

  const avatar = user?.avatarUrl ?? null
  const banner = user?.bannerUrl ?? null

  const totalPoints = matrizesProgress.totalPoints + basicosProgress.totalPoints
  const combinedAccuracy = useMemo(() => {
    const accuracies = [matrizesProgress.averageAccuracy, basicosProgress.averageAccuracy].filter((a) => a > 0)
    if (accuracies.length === 0) return 0
    return accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length
  }, [matrizesProgress.averageAccuracy, basicosProgress.averageAccuracy])
  const bestStreak = Math.max(matrizesProgress.streakCount, basicosProgress.streakCount)

  const initials = initialsFor(user?.displayName)
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const allModules: ModuleOption[] = [
    { config: BASICOS_MODULE_CONFIG, hash: '#basicos', started: Object.keys(basicosProgress.state.completedNodeIds).length > 0 },
    { config: MATRIZES_MODULE_CONFIG, hash: '#modulos', started: Object.keys(matrizesProgress.state.completedNodeIds).length > 0 },
  ]
  const startedModules = allModules.filter((m) => m.started)

  const achievements = useMemo(() => {
    const matrizesCompletedTrackNodes = MATRIZES_MODULE_CONFIG.track.filter(
      (n) => matrizesProgress.state.completedNodeIds[n.id],
    ).length
    const basicosCompletedTrackNodes = BASICOS_MODULE_CONFIG.track.filter(
      (n) => basicosProgress.state.completedNodeIds[n.id],
    ).length
    const hasCompletedModule =
      (MATRIZES_MODULE_CONFIG.track.length > 0 && matrizesCompletedTrackNodes === MATRIZES_MODULE_CONFIG.track.length) ||
      (BASICOS_MODULE_CONFIG.track.length > 0 && basicosCompletedTrackNodes === BASICOS_MODULE_CONFIG.track.length)

    const allResults = [
      ...Object.values(matrizesProgress.state.exerciseResults),
      ...Object.values(basicosProgress.state.exerciseResults),
    ]
    const totalEndlessAnswered = [matrizesProgress.state.endless, basicosProgress.state.endless]
      .flatMap((e) => Object.values(e))
      .reduce((sum, stats) => sum + stats.totalAnswered, 0)

    return computeAchievements({
      totalCompletedNodes:
        Object.keys(matrizesProgress.state.completedNodeIds).length +
        Object.keys(basicosProgress.state.completedNodeIds).length,
      startedModuleCount: startedModules.length,
      hasPerfectSet: allResults.some((r) => r.bestAccuracy >= 1),
      bestStreak,
      totalPoints,
      totalEndlessAnswered,
      hasCompletedModule,
    })
  }, [matrizesProgress.state, basicosProgress.state, startedModules.length, bestStreak, totalPoints])

  const handleLogout = () => {
    void logout().then(() => onNavigate('#hero'))
  }

  const startEditingBio = () => {
    setBioDraft(bio)
    setBioEditing(true)
  }

  const saveBio = () => {
    setBio(bioDraft.trim())
    setBioEditing(false)
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
            <h1>{user?.displayName ?? 'Estudante'}</h1>
            <p className="perfil-summary__email">{user?.email}</p>
            {memberSince ? <p className="perfil-summary__meta">Aluno desde {memberSince}</p> : null}
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
                <button type="button" className="btn-secondary" onClick={() => setBioEditing(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn-primary" onClick={saveBio}>
                  Salvar
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
          <button type="button" className="btn-secondary" onClick={() => setPickerOpen(true)}>
            Acessar outros módulos
          </button>
        </div>

        {startedModules.length > 0 ? (
          <div className="perfil-modules-grid">
            {startedModules.map((m) => (
              <ModuleProgressCard
                key={m.config.moduleId}
                config={m.config}
                hash={m.hash}
                state={m.config.moduleId === 'matrizes' ? matrizesProgress.state : basicosProgress.state}
                averageAccuracy={m.config.moduleId === 'matrizes' ? matrizesProgress.averageAccuracy : basicosProgress.averageAccuracy}
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
    </div>
  )
}

export default PerfilPage
