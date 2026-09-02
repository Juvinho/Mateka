import { SISTEMAS_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const SISTEMAS_TRACK: TrackNode[] = buildTrack(SISTEMAS_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-intro-sistemas-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-substituicao-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-adicao-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-grafico-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-classificacao-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-sistemas3x3-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-escalonamento-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-matricial-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-cramer-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(SISTEMAS_TRACK, nodeId, completedNodeIds)
}
