import { useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import { useAuth } from '../state/useAuth'
import { useAmbience } from '../hooks/useAmbience'
import { useAggregatedProgress } from '../hooks/useAggregatedProgress'
import { getSettings, setSetting } from '../lib/settingsStore'
import type { Settings, ColorblindMode } from '../lib/settingsStore'
import { deleteAccount } from '../lib/profileApi'
import { initialsFor } from '../lib/initials'

type Props = {
  onNavigate: (hash: string) => void
}

type ToggleProps = {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const SettingToggle = ({ label, description, checked, onChange }: ToggleProps) => (
  <div className="settings-row">
    <div className="settings-row__text">
      <p className="settings-row__label">{label}</p>
      <p className="settings-row__description">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-switch${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-switch__thumb" />
    </button>
  </div>
)

const COLORBLIND_OPTIONS: { value: ColorblindMode; label: string; description: string }[] = [
  {
    value: 'off',
    label: 'Desativado',
    description: 'Cores padrão do site.',
  },
  {
    value: 'protanopia',
    label: 'Protanopia',
    description: 'Dificuldade em perceber vermelho. Troca o "certo"/"errado" dos exercícios por azul/laranja.',
  },
  {
    value: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Dificuldade em perceber verde — a forma mais comum de daltonismo. Troca o "certo"/"errado" dos exercícios por azul/laranja.',
  },
  {
    value: 'tritanopia',
    label: 'Tritanopia',
    description: 'Dificuldade em perceber azul/amarelo. Não afeta a distinção entre vermelho e verde, então as cores padrão do site já funcionam bem — essa opção não muda nada de propósito.',
  },
]

type RadioProps = {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

const ColorblindModeOption = ({ label, description, selected, onSelect }: RadioProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    className={`settings-radio-row${selected ? ' is-selected' : ''}`}
    onClick={onSelect}
  >
    <span className="settings-radio" aria-hidden="true" />
    <span className="settings-row__text">
      <span className="settings-row__label">{label}</span>
      <span className="settings-row__description">{description}</span>
    </span>
  </button>
)

const ConfiguracoesPage = ({ onNavigate }: Props) => {
  const { user, refresh } = useAuth()
  const { bestStreak } = useAggregatedProgress()
  const { enabled: ambienceEnabled, toggle: toggleAmbience } = useAmbience()
  const initials = initialsFor(user?.displayName)

  const [settings, setSettings] = useState(getSettings)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(setSetting(key, value))
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    setDeleting(true)
    try {
      await deleteAccount(deletePassword)
      await refresh()
      onNavigate('#hero')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir a conta.')
      setDeleting(false)
    }
  }

  return (
    <div className="perfil-page">
      <header className="modulos-header">
        <div className="modulos-header-inner">
          <MatekaLogo onClick={() => onNavigate('#hero')} ariaLabel="Ir para o início" />
          <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
            <button type="button" className="modulos-breadcrumb-link" onClick={() => onNavigate('#perfil')}>
              Dashboard
            </button>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="modulos-breadcrumb-current">Configurações</span>
          </nav>

          <div className="modulos-streak-badge" aria-label={`Streak de ${bestStreak} dias`}>
            🔥 {bestStreak} dias
          </div>

          <ProfileDropdown initials={initials} />
        </div>
      </header>

      <main className="perfil-shell">
        <div className="perfil-header">
          <div>
            <p className="section-kicker">Configurações</p>
            <h2>Deixa do seu jeito.</h2>
          </div>
        </div>

        <section className="settings-section">
          <p className="section-kicker">Som</p>
          <SettingToggle
            label="Voz da Emy-chan"
            description="As falas narradas da mascote nas introduções e nos avisos. Desativar silencia o áudio, o texto continua aparecendo normalmente."
            checked={settings.emyVoiceEnabled}
            onChange={(value) => update('emyVoiceEnabled', value)}
          />
          <SettingToggle
            label="Efeitos sonoros"
            description="O som curto ao acertar ou errar um exercício."
            checked={settings.sfxEnabled}
            onChange={(value) => update('sfxEnabled', value)}
          />
          <SettingToggle
            label="Música ambiente"
            description="Trilha de fundo suave enquanto você navega pelo site."
            checked={ambienceEnabled}
            onChange={() => void toggleAmbience()}
          />
        </section>

        <section className="settings-section">
          <p className="section-kicker">Acessibilidade</p>
          <p className="settings-row__description">
            Paleta para daltonismo — escolha o tipo pra ajustar as cores de "certo"/"errado" dos exercícios.
          </p>
          <div className="settings-radio-group" role="radiogroup" aria-label="Paleta para daltonismo">
            {COLORBLIND_OPTIONS.map((option) => (
              <ColorblindModeOption
                key={option.value}
                label={option.label}
                description={option.description}
                selected={settings.colorblindMode === option.value}
                onSelect={() => update('colorblindMode', option.value)}
              />
            ))}
          </div>
        </section>

        <section className="settings-section settings-section--danger">
          <p className="section-kicker settings-danger-kicker">Zona de perigo</p>

          {!deleteOpen ? (
            <div className="settings-row">
              <div className="settings-row__text">
                <p className="settings-row__label">Excluir conta</p>
                <p className="settings-row__description">
                  Remove sua conta e todo o seu progresso, amizades, bio e imagens permanentemente. Não tem como
                  desfazer.
                </p>
              </div>
              <button type="button" className="btn-secondary settings-danger-btn" onClick={() => setDeleteOpen(true)}>
                Excluir conta
              </button>
            </div>
          ) : (
            <div className="settings-delete-confirm">
              <p className="settings-row__description">
                Isso é permanente: seu perfil, progresso em todos os módulos, amigos, bio, avatar e banner serão
                apagados e não podem ser recuperados. Digite sua senha para confirmar.
              </p>
              <input
                type="password"
                className="settings-delete-confirm__input"
                placeholder="Sua senha"
                value={deletePassword}
                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(null) }}
                autoFocus
              />
              {deleteError ? <p className="perfil-image-error" role="alert">{deleteError}</p> : null}
              <div className="settings-delete-confirm__actions">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={deleting}
                  onClick={() => { setDeleteOpen(false); setDeletePassword(''); setDeleteError(null) }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="settings-danger-btn settings-danger-btn--confirm"
                  disabled={deleting || !deletePassword}
                  onClick={() => void handleDeleteAccount()}
                >
                  {deleting ? 'Excluindo...' : 'Excluir permanentemente'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ConfiguracoesPage
