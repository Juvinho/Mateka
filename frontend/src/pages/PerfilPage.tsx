import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ModulePickerModal from '../components/profile/ModulePickerModal'
import type { ModuleOption } from '../components/profile/ModulePickerModal'
import FriendsModal from '../components/social/FriendsModal'
import { listAcceptedUnseen } from '../lib/socialApi'
import { useAuth } from '../state/useAuth'
import { useModuleProgress } from '../state/useModuleProgress'
import type { ModuleProgressState } from '../state/useModuleProgress'
import { resizeImageToBlob } from '../lib/imageResize'
import { uploadAvatar, uploadBanner, deleteAvatar, deleteBanner, updateBio } from '../lib/profileApi'
import { computeAchievements } from '../data/achievements'
import { MATRIZES_MODULE_CONFIG } from '../data/matrizes/moduleConfig'
import { BASICOS_MODULE_CONFIG } from '../data/basicos/moduleConfig'
import { PRECALCULO_MODULE_CONFIG } from '../data/precalculo/moduleConfig'
import { SISTEMAS_MODULE_CONFIG } from '../data/sistemas/moduleConfig'
import { GEOMETRIA_MODULE_CONFIG } from '../data/geometria/moduleConfig'
import { PLANA_MODULE_CONFIG } from '../data/plana/moduleConfig'
import { ESPACIAL_MODULE_CONFIG } from '../data/espacial/moduleConfig'
import type { ModuleConfig } from './ModulosPage'
import { initialsFor } from '../lib/initials'

const BIO_MAX_LENGTH = 240

type Props = {
  onNavigate: (hash: string) => void
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
  const precalculoProgress = useModuleProgress('pre-calculo')
  const sistemasProgress = useModuleProgress('sistemas-lineares')
  const geometriaProgress = useModuleProgress('geometria-analitica')
  const planaProgress = useModuleProgress('geometria-plana')
  const espacialProgress = useModuleProgress('geometria-espacial')
  const bio = user?.bio ?? ''

  const [pickerOpen, setPickerOpen] = useState(false)
  const [friendsTab, setFriendsTab] = useState<'amigos' | 'buscar' | null>(null)
  const [hasUnseenAcceptance, setHasUnseenAcceptance] = useState(false)
  const handleAcceptedSeen = useCallback(() => setHasUnseenAcceptance(false), [])

  useEffect(() => {
    let cancelled = false
    listAcceptedUnseen()
      .then((users) => { if (!cancelled) setHasUnseenAcceptance(users.length > 0) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
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

  const totalPoints =
    matrizesProgress.totalPoints +
    basicosProgress.totalPoints +
    precalculoProgress.totalPoints +
    sistemasProgress.totalPoints +
    geometriaProgress.totalPoints +
    planaProgress.totalPoints +
    espacialProgress.totalPoints
  const combinedAccuracy = useMemo(() => {
    const accuracies = [
      matrizesProgress.averageAccuracy,
      basicosProgress.averageAccuracy,
      precalculoProgress.averageAccuracy,
      sistemasProgress.averageAccuracy,
      geometriaProgress.averageAccuracy,
      planaProgress.averageAccuracy,
      espacialProgress.averageAccuracy,
    ].filter((a) => a > 0)
    if (accuracies.length === 0) return 0
    return accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length
  }, [
    matrizesProgress.averageAccuracy,
    basicosProgress.averageAccuracy,
    precalculoProgress.averageAccuracy,
    sistemasProgress.averageAccuracy,
    geometriaProgress.averageAccuracy,
    planaProgress.averageAccuracy,
    espacialProgress.averageAccuracy,
  ])
  const bestStreak = Math.max(
    matrizesProgress.streakCount,
    basicosProgress.streakCount,
    precalculoProgress.streakCount,
    sistemasProgress.streakCount,
    geometriaProgress.streakCount,
    planaProgress.streakCount,
    espacialProgress.streakCount,
  )

  const initials = initialsFor(user?.displayName)
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  // Single source of truth for "which useModuleProgress result belongs to
  // which module" — used both to build allModules below and to look up the
  // right progress when rendering each started module's card, so a new
  // module can never silently fall through to another one's numbers.
  const progressByModuleId = {
    matrizes: matrizesProgress,
    'conceitos-basicos': basicosProgress,
    'pre-calculo': precalculoProgress,
    'sistemas-lineares': sistemasProgress,
    'geometria-analitica': geometriaProgress,
    'geometria-plana': planaProgress,
    'geometria-espacial': espacialProgress,
  }

  const allModules: ModuleOption[] = [
    { config: BASICOS_MODULE_CONFIG, hash: '#basicos', started: Object.keys(basicosProgress.state.completedNodeIds).length > 0 },
    { config: MATRIZES_MODULE_CONFIG, hash: '#modulos', started: Object.keys(matrizesProgress.state.completedNodeIds).length > 0 },
    { config: PRECALCULO_MODULE_CONFIG, hash: '#pre-calculo', started: Object.keys(precalculoProgress.state.completedNodeIds).length > 0 },
    { config: SISTEMAS_MODULE_CONFIG, hash: '#sistemas-lineares', started: Object.keys(sistemasProgress.state.completedNodeIds).length > 0 },
    { config: GEOMETRIA_MODULE_CONFIG, hash: '#geometria-analitica', started: Object.keys(geometriaProgress.state.completedNodeIds).length > 0 },
    { config: PLANA_MODULE_CONFIG, hash: '#geometria-plana', started: Object.keys(planaProgress.state.completedNodeIds).length > 0 },
    { config: ESPACIAL_MODULE_CONFIG, hash: '#geometria-espacial', started: Object.keys(espacialProgress.state.completedNodeIds).length > 0 },
  ]
  const startedModules = allModules.filter((m) => m.started)

  const achievements = useMemo(() => {
    const matrizesCompletedTrackNodes = MATRIZES_MODULE_CONFIG.track.filter(
      (n) => matrizesProgress.state.completedNodeIds[n.id],
    ).length
    const basicosCompletedTrackNodes = BASICOS_MODULE_CONFIG.track.filter(
      (n) => basicosProgress.state.completedNodeIds[n.id],
    ).length
    const precalculoCompletedTrackNodes = PRECALCULO_MODULE_CONFIG.track.filter(
      (n) => precalculoProgress.state.completedNodeIds[n.id],
    ).length
    const sistemasCompletedTrackNodes = SISTEMAS_MODULE_CONFIG.track.filter(
      (n) => sistemasProgress.state.completedNodeIds[n.id],
    ).length
    const geometriaCompletedTrackNodes = GEOMETRIA_MODULE_CONFIG.track.filter(
      (n) => geometriaProgress.state.completedNodeIds[n.id],
    ).length
    const planaCompletedTrackNodes = PLANA_MODULE_CONFIG.track.filter(
      (n) => planaProgress.state.completedNodeIds[n.id],
    ).length
    const espacialCompletedTrackNodes = ESPACIAL_MODULE_CONFIG.track.filter(
      (n) => espacialProgress.state.completedNodeIds[n.id],
    ).length
    const hasCompletedModule =
      (MATRIZES_MODULE_CONFIG.track.length > 0 && matrizesCompletedTrackNodes === MATRIZES_MODULE_CONFIG.track.length) ||
      (BASICOS_MODULE_CONFIG.track.length > 0 && basicosCompletedTrackNodes === BASICOS_MODULE_CONFIG.track.length) ||
      (PRECALCULO_MODULE_CONFIG.track.length > 0 && precalculoCompletedTrackNodes === PRECALCULO_MODULE_CONFIG.track.length) ||
      (SISTEMAS_MODULE_CONFIG.track.length > 0 && sistemasCompletedTrackNodes === SISTEMAS_MODULE_CONFIG.track.length) ||
      (GEOMETRIA_MODULE_CONFIG.track.length > 0 && geometriaCompletedTrackNodes === GEOMETRIA_MODULE_CONFIG.track.length) ||
      (PLANA_MODULE_CONFIG.track.length > 0 && planaCompletedTrackNodes === PLANA_MODULE_CONFIG.track.length) ||
      (ESPACIAL_MODULE_CONFIG.track.length > 0 && espacialCompletedTrackNodes === ESPACIAL_MODULE_CONFIG.track.length)

    const allResults = [
      ...Object.values(matrizesProgress.state.exerciseResults),
      ...Object.values(basicosProgress.state.exerciseResults),
      ...Object.values(precalculoProgress.state.exerciseResults),
      ...Object.values(sistemasProgress.state.exerciseResults),
      ...Object.values(geometriaProgress.state.exerciseResults),
      ...Object.values(planaProgress.state.exerciseResults),
      ...Object.values(espacialProgress.state.exerciseResults),
    ]
    const totalEndlessAnswered = [
      matrizesProgress.state.endless,
      basicosProgress.state.endless,
      precalculoProgress.state.endless,
      sistemasProgress.state.endless,
      geometriaProgress.state.endless,
      planaProgress.state.endless,
      espacialProgress.state.endless,
    ]
      .flatMap((e) => Object.values(e))
      .reduce((sum, stats) => sum + stats.totalAnswered, 0)

    return computeAchievements({
      totalCompletedNodes:
        Object.keys(matrizesProgress.state.completedNodeIds).length +
        Object.keys(basicosProgress.state.completedNodeIds).length +
        Object.keys(precalculoProgress.state.completedNodeIds).length +
        Object.keys(sistemasProgress.state.completedNodeIds).length +
        Object.keys(geometriaProgress.state.completedNodeIds).length +
        Object.keys(planaProgress.state.completedNodeIds).length +
        Object.keys(espacialProgress.state.completedNodeIds).length,
      startedModuleCount: startedModules.length,
      hasPerfectSet: allResults.some((r) => r.bestAccuracy >= 1),
      bestStreak,
      totalPoints,
      totalEndlessAnswered,
      hasCompletedModule,
    })
  }, [
    matrizesProgress.state,
    basicosProgress.state,
    precalculoProgress.state,
    sistemasProgress.state,
    geometriaProgress.state,
    planaProgress.state,
    espacialProgress.state,
    startedModules.length,
    bestStreak,
    totalPoints,
  ])

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
              {hasUnseenAcceptance ? <span className="perfil-friends-btn__dot" aria-label="Novidades em Amigos" /> : null}
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
          onClose={() => setFriendsTab(null)}
          onAcceptedSeen={handleAcceptedSeen}
        />
      ) : null}
    </div>
  )
}

export default PerfilPage
