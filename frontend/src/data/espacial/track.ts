import { ESPACIAL_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const ESPACIAL_TRACK: TrackNode[] = buildTrack(ESPACIAL_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-solidos-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-prismas-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-piramides-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-cilindro-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-cone-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-esfera-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-troncos-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-inscricao-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-aplicacoes-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(ESPACIAL_TRACK, nodeId, completedNodeIds)
}
