import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ModuleConfig } from '../../pages/ModulosPage'

export type ModuleOption = {
  config: ModuleConfig
  hash: string
  started: boolean
}

type Props = {
  modules: ModuleOption[]
  onSelect: (hash: string) => void
  onClose: () => void
}

const ModulePickerModal = ({ modules, onSelect, onClose }: Props) => {
  const [alreadyInId, setAlreadyInId] = useState<string | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handlePick = (option: ModuleOption) => {
    if (option.started) {
      setAlreadyInId(option.config.moduleId)
      return
    }
    onSelect(option.hash)
  }

  return createPortal(
    <div className="module-picker-backdrop" onClick={onClose}>
      <div
        className="module-picker-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Escolher módulo"
      >
        <div className="module-picker-header">
          <h2>Acessar outros módulos</h2>
          <button type="button" className="module-picker-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="module-picker-list">
          {modules.map((option) => (
            <div key={option.config.moduleId} className="module-picker-item-wrap">
              <button
                type="button"
                className={`module-picker-item${option.started ? ' is-started' : ''}`}
                onClick={() => handlePick(option)}
              >
                <span className="module-picker-item__icon" aria-hidden="true">{option.config.icon}</span>
                <span className="module-picker-item__body">
                  <strong>{option.config.name}</strong>
                  <span>{option.config.description}</span>
                </span>
                {option.started ? <span className="module-picker-item__badge">Em andamento</span> : null}
              </button>
              {alreadyInId === option.config.moduleId ? (
                <p className="module-picker-item__notice" role="status">Você já está nesse módulo.</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ModulePickerModal
