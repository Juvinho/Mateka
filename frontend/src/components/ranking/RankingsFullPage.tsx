import { useState } from 'react'
import type { RankedEntry } from '../../state/useRanking'
import { MODULE_REWARD_CONFIGS } from '../../data/rankingConfig'
import miiChanNeutral from '../../assets/mascot/mii-chan-neutral.jpg'

interface RankingsFullPageProps {
  rankings: { moduleId: string; moduleName: string; entries: RankedEntry[] }[]
  localUserId: string
  onNavigate: (hash: string) => void
}

const MEDAL = ['🥇', '🥈', '🥉']

function EmptyState() {
  return (
    <div className="rankings-full-empty">
      <p>Nenhum resultado registrado aqui. Complete exercícios deste módulo para aparecer no ranking.</p>
    </div>
  )
}

function EntryRow({ entry, isLocal }: { entry: RankedEntry; isLocal: boolean }) {
  const isPodium = entry.position <= 3
  return (
    <div
      className={[
        'rfp-entry',
        isPodium ? `rfp-entry--pos${entry.position}` : '',
        isLocal ? 'rfp-entry--local' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="rfp-entry__pos">
        {isPodium ? MEDAL[entry.position - 1] : `#${entry.position}`}
      </span>
      <span className="rfp-entry__name">
        {entry.displayName}
        {isLocal && <span className="rfp-entry__you"> (você)</span>}
      </span>
      <span className="rfp-entry__pts">{entry.totalPoints} pts</span>
      <span className="rfp-entry__correct">{entry.totalCorrect} acertos</span>
      {entry.rewardIcon ? (
        <span className="rfp-entry__reward" title={entry.rewardLabel}>
          {entry.rewardIcon}
        </span>
      ) : (
        <span className="rfp-entry__reward" />
      )}
    </div>
  )
}

export function RankingsFullPage({ rankings, localUserId, onNavigate }: RankingsFullPageProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = rankings[activeIdx]
  const rewardConfig = MODULE_REWARD_CONFIGS.find((c) => c.moduleId === active?.moduleId)

  return (
    <div className="rankings-full-page">
      {/* Header */}
      <div className="rankings-full-page__header">
        <div className="rankings-full-page__header-left">
          <img
            src={miiChanNeutral}
            alt="Mii-chan apresentando os rankings"
            className="rankings-full-page__mascot"
          />
          <div>
            <p className="rankings-full-page__kicker">Leaderboard</p>
            <h1 className="rankings-full-page__title">Rankings por Módulo</h1>
            <p className="rankings-full-page__desc">
              Estes são os melhores resultados registrados. Se quiser uma posição melhor, vai ter que acertar mais.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rankings-full-page__back"
          onClick={() => onNavigate('#hero')}
        >
          ← Voltar
        </button>
      </div>

      {/* Module tabs */}
      <div className="rankings-full-page__tabs" role="tablist" aria-label="Módulos">
        {rankings.map((r, idx) => (
          <button
            key={r.moduleId}
            type="button"
            role="tab"
            aria-selected={idx === activeIdx}
            className={`rfp-tab${idx === activeIdx ? ' rfp-tab--active' : ''}`}
            onClick={() => setActiveIdx(idx)}
          >
            {r.moduleName}
          </button>
        ))}
      </div>

      {/* Content */}
      {active && (
        <div className="rankings-full-page__body">
          {/* Rewards legend */}
          {rewardConfig && (
            <div className="rfp-rewards">
              <p className="rfp-rewards__title">Recompensas — {active.moduleName}</p>
              <div className="rfp-rewards__tiers">
                {rewardConfig.tiers.map((tier) => (
                  <div key={tier.position} className="rfp-reward-tier">
                    <span className="rfp-reward-tier__icon">{tier.icon}</span>
                    <div>
                      <p className="rfp-reward-tier__label">{tier.label}</p>
                      <p className="rfp-reward-tier__desc">{tier.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="rfp-list">
            <div className="rfp-list__head">
              <span>Posição</span>
              <span>Nome</span>
              <span>Pontos</span>
              <span>Acertos</span>
              <span>Prêmio</span>
            </div>

            {active.entries.length === 0 ? (
              <EmptyState />
            ) : (
              active.entries.map((entry) => (
                <EntryRow
                  key={entry.userId}
                  entry={entry}
                  isLocal={entry.userId === localUserId}
                />
              ))
            )}
          </div>

          <p className="rfp-tiebreaker">
            Empates: acertos totais → melhor precisão → mais questões respondidas → atividade mais recente.
          </p>
        </div>
      )}
    </div>
  )
}
