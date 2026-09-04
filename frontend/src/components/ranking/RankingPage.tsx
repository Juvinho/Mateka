import { useState } from 'react'
import type { RankedEntry } from '../../state/useRanking'
import { MODULE_REWARD_CONFIGS } from '../../data/rankingConfig'

interface RankingPageProps {
  rankings: { moduleId: string; moduleName: string; entries: RankedEntry[] }[]
  localUserId: string
  onClose: () => void
}

const MEDAL = ['🥇', '🥈', '🥉']

function EmptyState() {
  return (
    <div className="ranking-empty">
      <p className="ranking-empty__text">
        Nenhum resultado registrado aqui ainda. Complete exercícios de um módulo para aparecer no ranking.
      </p>
    </div>
  )
}

function EntryRow({
  entry,
  isLocal,
}: {
  entry: RankedEntry
  isLocal: boolean
}) {
  const isPodium = entry.position <= 3
  return (
    <div
      className={`ranking-entry${isPodium ? ` ranking-entry--pos${entry.position}` : ''} ${isLocal ? 'ranking-entry--local' : ''}`}
    >
      <span className="ranking-entry__pos">
        {isPodium ? MEDAL[entry.position - 1] : `#${entry.position}`}
      </span>
      <span className="ranking-entry__name">
        {entry.displayName}
        {isLocal && <span className="ranking-entry__you"> (você)</span>}
      </span>
      <span className="ranking-entry__points">{entry.totalPoints} pts</span>
      <span className="ranking-entry__correct">{entry.totalCorrect} acertos</span>
      {entry.rewardIcon && (
        <span className="ranking-entry__reward" title={entry.rewardLabel}>
          {entry.rewardIcon}
        </span>
      )}
    </div>
  )
}

export function RankingPage({ rankings, localUserId, onClose }: RankingPageProps) {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0)
  const activeRanking = rankings[activeModuleIdx]
  const rewardConfig = MODULE_REWARD_CONFIGS.find((c) => c.moduleId === activeRanking?.moduleId)

  return (
    <div className="ranking-page">
      <div className="ranking-page__header">
        <h2 className="ranking-page__title">Rankings por Módulo</h2>
        <button
          type="button"
          className="ranking-page__close"
          onClick={onClose}
          aria-label="Fechar rankings"
        >
          ×
        </button>
      </div>

      {/* Module tabs */}
      <div className="ranking-page__tabs" role="tablist" aria-label="Módulos">
        {rankings.map((r, idx) => (
          <button
            key={r.moduleId}
            type="button"
            role="tab"
            aria-selected={idx === activeModuleIdx}
            className={`ranking-tab${idx === activeModuleIdx ? ' ranking-tab--active' : ''}`}
            onClick={() => setActiveModuleIdx(idx)}
          >
            {r.moduleName}
          </button>
        ))}
      </div>

      {activeRanking && (
        <div className="ranking-page__body">
          {/* Reward legend for this module */}
          {rewardConfig && (
            <div className="ranking-rewards-legend">
              <p className="ranking-rewards-legend__title">Recompensas deste módulo</p>
              <div className="ranking-rewards-legend__tiers">
                {rewardConfig.tiers.map((tier) => (
                  <div key={tier.position} className="ranking-reward-tier">
                    <span className="ranking-reward-tier__icon">{tier.icon}</span>
                    <div>
                      <p className="ranking-reward-tier__label">{tier.label}</p>
                      <p className="ranking-reward-tier__desc">{tier.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="ranking-list">
            <div className="ranking-list__header">
              <span>Posição</span>
              <span>Nome</span>
              <span>Pontos</span>
              <span>Acertos</span>
              <span>Prêmio</span>
            </div>
            {activeRanking.entries.length === 0 ? (
              <EmptyState />
            ) : (
              activeRanking.entries.map((entry) => (
                <EntryRow
                  key={entry.userId}
                  entry={entry}
                  isLocal={entry.userId === localUserId}
                />
              ))
            )}
          </div>

          {/* Tie-breaker note */}
          <p className="ranking-tiebreaker-note">
            Empates são resolvidos por: acertos totais → melhor precisão → mais questões respondidas → atividade mais recente.
          </p>
        </div>
      )}
    </div>
  )
}
