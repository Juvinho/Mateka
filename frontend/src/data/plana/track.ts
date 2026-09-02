import { PLANA_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const PLANA_TRACK: TrackNode[] = buildTrack(PLANA_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-angulos-desafio' }],
  2: [{ kind: 'exercise', id: 'ex-triangulos-desafio' }],
  3: [{ kind: 'exercise', id: 'ex-congruencia-desafio' }],
  4: [{ kind: 'exercise', id: 'ex-metricas-desafio' }],
  5: [{ kind: 'exercise', id: 'ex-poligonos-desafio' }],
  6: [{ kind: 'exercise', id: 'ex-quadrilateros-desafio' }],
  7: [{ kind: 'exercise', id: 'ex-area-desafio' }],
  8: [{ kind: 'exercise', id: 'ex-circulo-desafio' }],
  9: [{ kind: 'exercise', id: 'ex-metricascirculo-desafio' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(PLANA_TRACK, nodeId, completedNodeIds)
}
