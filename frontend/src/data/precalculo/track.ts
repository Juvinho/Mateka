import { PRECALCULO_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const PRECALCULO_TRACK: TrackNode[] = buildTrack(PRECALCULO_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-intro-funcoes-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-afim-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-quadratica-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-modular-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-composta-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-exponencial-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-log-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-pa-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-pg-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(PRECALCULO_TRACK, nodeId, completedNodeIds)
}
