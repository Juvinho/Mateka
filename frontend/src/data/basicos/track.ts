import { BASICOS_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const TRACK: TrackNode[] = buildTrack(BASICOS_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-conjuntos-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-operacoes-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-fracoes-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-potenciacao-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-fatoracao-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-equacoes-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-funcoes-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-geometria-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-notacao-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(TRACK, nodeId, completedNodeIds)
}
