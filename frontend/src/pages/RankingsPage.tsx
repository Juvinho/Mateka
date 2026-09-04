import { useState } from 'react'
import MatekaLogo from '../components/MatekaLogo'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import { useAuth } from '../state/useAuth'
import { initialsFor } from '../lib/initials'
import type { RankedEntry } from '../state/useRanking'
import { MODULE_REWARD_CONFIGS } from '../data/rankingConfig'
import miiChanObserving from '../assets/mascot/mii-chan-observing.png'
import miiChanNeutral from '../assets/mascot/mii-chan-neutral.png'

type Props = {
  rankings: { moduleId: string; moduleName: string; entries: RankedEntry[] }[]
  localUserId: string
  onNavigate: (hash: string) => void
}

const MEDAL_ICONS = ['🥇', '🥈', '🥉']
const MEDAL_LABELS = ['1º Lugar', '2º Lugar', '3º Lugar']

export default function RankingsPage({ rankings, localUserId, onNavigate }: Props) {
  const { user } = useAuth()
  const initials = initialsFor(user?.displayName)
  const [activeModuleIdx, setActiveModuleIdx] = useState(0)

  const activeRanking = rankings[activeModuleIdx] ?? rankings[0]
  const rewardConfig = MODULE_REWARD_CONFIGS.find((c) => c.moduleId === activeRanking?.moduleId)

  const top3 = activeRanking ? activeRanking.entries.slice(0, 3) : []

  return (
    <div className="perfil-page rankings-full-page-view">
      {/* Top Header matching Mateka's pages */}
      <header className="modulos-header">
        <div className="modulos-header-inner">
          <MatekaLogo onClick={() => onNavigate('#hero')} ariaLabel="Ir para o início" />
          <nav className="modulos-breadcrumb" aria-label="Caminho de navegação">
            <button
              type="button"
              className="modulos-breadcrumb-link"
              onClick={() => onNavigate('#hero')}
            >
              Início
            </button>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">
              ›
            </span>
            <button
              type="button"
              className="modulos-breadcrumb-link"
              onClick={() => onNavigate('#rankings')}
            >
              Rankings
            </button>
            <span className="modulos-breadcrumb-sep" aria-hidden="true">
              ›
            </span>
            <span className="modulos-breadcrumb-current">Classificação Geral</span>
          </nav>

          <div className="rankings-header-actions">
            <button
              type="button"
              className="btn-secondary rankings-back-btn"
              onClick={() => onNavigate('#rankings')}
              aria-label="Voltar para a página inicial"
            >
              ← Voltar ao Início
            </button>
            <ProfileDropdown initials={initials} />
          </div>
        </div>
      </header>

      <main className="perfil-shell rankings-page-shell">
        {/* Intro banner with Mii-chan */}
        <section className="rankings-hero-banner">
          <div className="rankings-hero-mascot">
            <img
              src={miiChanObserving}
              alt="Mii-chan observando os rankings com indiferença"
              className="rankings-hero-mascot-img"
            />
          </div>
          <div className="rankings-hero-content">
            <div className="rankings-hero-bubble">
              <span className="rankings-hero-bubble-tag">Mii-chan</span>
              <p className="rankings-hero-bubble-text">
                A lista completa está aqui. Os três primeiros colocados ganham figurinhas exclusivas para exibir no perfil e usar no fórum.
              </p>
            </div>
            <h1 className="rankings-main-title">Tabela de Classificação dos Módulos</h1>
            <p className="rankings-main-subtitle">
              Selecione qualquer módulo para conferir colocações, pontos acumulados, acertos e as figurinhas exclusivas de perfil e fórum dos líderes.
            </p>
          </div>
        </section>

        {/* Module selection tabs */}
        <div className="rankings-module-nav" role="tablist" aria-label="Navegar entre módulos">
          {rankings.map((r, idx) => {
            const isActive = idx === activeModuleIdx
            return (
              <button
                key={r.moduleId}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`rankings-module-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveModuleIdx(idx)}
              >
                <span className="rankings-module-tab__name">{r.moduleName}</span>
                <span className="rankings-module-tab__count">
                  {r.entries.length} {r.entries.length === 1 ? 'jogador' : 'jogadores'}
                </span>
              </button>
            )
          })}
        </div>

        {activeRanking && (
          <section className="rankings-module-content">
            {/* Top 3 Podium and Rewards Showcase */}
            <div className="rankings-podium-section">
              <div className="rankings-podium-header">
                <h2 className="rankings-podium-title">Pódio e Figurinhas Exclusivas — {activeRanking.moduleName}</h2>
                <span className="rankings-podium-badge">Figurinhas de Perfil & Fórum</span>
              </div>

              <div className="rankings-podium-grid">
                {[1, 2, 3].map((pos) => {
                  const entry = top3[pos - 1]
                  const tier = rewardConfig?.tiers.find((t) => t.position === pos)
                  const isLocal = entry?.userId === localUserId

                  return (
                    <div
                      key={pos}
                      className={`rankings-podium-card rankings-podium-card--pos${pos} ${
                        isLocal ? 'is-local-user' : ''
                      }`}
                    >
                      <div className="rankings-podium-card__top">
                        <span className="rankings-podium-medal">{MEDAL_ICONS[pos - 1]}</span>
                        <span className="rankings-podium-pos-label">{MEDAL_LABELS[pos - 1]}</span>
                      </div>

                      <div className="rankings-podium-card__user">
                        {entry ? (
                          <>
                            <h3 className="rankings-podium-username">
                              {entry.displayName}
                              {isLocal && <span className="rankings-tag-you"> (você)</span>}
                            </h3>
                            <div className="rankings-podium-stats">
                              <span className="rankings-stat-pill">
                                <strong>{entry.totalPoints}</strong> pts
                              </span>
                              <span className="rankings-stat-pill">
                                <strong>{entry.totalCorrect}</strong> acertos
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="rankings-podium-vacant">
                            <span className="rankings-vacant-label">Vaga aberta</span>
                            <span className="rankings-vacant-hint">Complete exercícios para ocupar</span>
                          </div>
                        )}
                      </div>

                      {tier && (
                        <div className="rankings-podium-reward">
                          <div className="rankings-reward-badge">
                            <span className="rankings-reward-icon">{tier.icon}</span>
                            <div className="rankings-reward-info">
                              <span className="rankings-reward-type-tag">Figurinha Exclusiva</span>
                              <strong className="rankings-reward-name">{tier.label}</strong>
                              <p className="rankings-reward-desc">{tier.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Complete Table List */}
            <div className="rankings-table-container">
              <div className="rankings-table-header-row">
                <h3 className="rankings-table-title">Classificação Completa</h3>
                <span className="rankings-table-entries-count">
                  {activeRanking.entries.length} {activeRanking.entries.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              {activeRanking.entries.length === 0 ? (
                <div className="rankings-empty-box">
                  <img
                    src={miiChanNeutral}
                    alt="Mii-chan em pose neutra"
                    className="rankings-empty-mascot"
                  />
                  <p className="rankings-empty-title">Nenhum resultado registrado neste módulo.</p>
                  <p className="rankings-empty-desc">
                    Ninguém pontuou aqui ainda. Se quiser aparecer na tabela, resolva os conjuntos de exercícios ou pratique no modo Endless.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onNavigate('#conteudos')}
                  >
                    Acessar Módulos
                  </button>
                </div>
              ) : (
                <div className="rankings-table-wrapper">
                  <table className="rankings-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px', textAlign: 'center' }}>Posição</th>
                        <th>Aluno / Usuário</th>
                        <th style={{ width: '130px', textAlign: 'right' }}>Pontos</th>
                        <th style={{ width: '130px', textAlign: 'right' }}>Acertos</th>
                        <th style={{ width: '110px', textAlign: 'right' }}>Precisão</th>
                        <th style={{ width: '240px' }}>Figurinha / Recompensa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRanking.entries.map((entry) => {
                        const isLocal = entry.userId === localUserId
                        const isPodium = entry.position <= 3

                        return (
                          <tr
                            key={entry.userId}
                            className={`rankings-row ${isPodium ? `is-podium-${entry.position}` : ''} ${
                              isLocal ? 'is-local-row' : ''
                            }`}
                          >
                            <td className="rankings-cell-pos" style={{ textAlign: 'center' }}>
                              {isPodium ? (
                                <span className="rankings-podium-icon-cell">
                                  {MEDAL_ICONS[entry.position - 1]}
                                </span>
                              ) : (
                                <span className="rankings-num-pos">#{entry.position}</span>
                              )}
                            </td>
                            <td className="rankings-cell-name">
                              <span className="rankings-player-name">{entry.displayName}</span>
                              {isLocal && <span className="rankings-tag-you"> (você)</span>}
                            </td>
                            <td className="rankings-cell-points" style={{ textAlign: 'right' }}>
                              <strong>{entry.totalPoints}</strong> pts
                            </td>
                            <td className="rankings-cell-correct" style={{ textAlign: 'right' }}>
                              {entry.totalCorrect} acertos
                            </td>
                            <td className="rankings-cell-accuracy" style={{ textAlign: 'right' }}>
                              {Math.round(entry.bestAccuracy * 100)}%
                            </td>
                            <td className="rankings-cell-reward">
                              {entry.rewardLabel ? (
                                <span className="rankings-table-reward-tag" title={entry.rewardLabel}>
                                  <span className="rankings-table-reward-icon">{entry.rewardIcon}</span>
                                  <span className="rankings-table-reward-text">{entry.rewardLabel}</span>
                                </span>
                              ) : (
                                <span className="rankings-no-reward">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Deterministic tie-breaker explanation */}
              <div className="rankings-tiebreaker-box">
                <span className="rankings-tiebreaker-icon">ℹ️</span>
                <p className="rankings-tiebreaker-text">
                  <strong>Regra de Desempate Determinística:</strong> Em caso de empate na pontuação, o sistema avalia sucessivamente: 1º Total de acertos acumulados → 2º Maior taxa de precisão nos exercícios → 3º Quantidade de questões respondidas → 4º Atividade mais recente registrada.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
