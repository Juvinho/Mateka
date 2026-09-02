import { GEOMETRIA_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const GEOMETRIA_TRACK: TrackNode[] = buildTrack(GEOMETRIA_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-coordenadas-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-pontomedio-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-reta-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-posicoesretas-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-distanciaponto-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-circunferencia-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-posicoescirc-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-elipse-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-conicas-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(GEOMETRIA_TRACK, nodeId, completedNodeIds)
}
