import { MATRIZES_UNITS } from './units'
import { buildTrack, isNodeUnlockedIn, type TrackNode } from '../trackUtils'

export type { TrackNode }

export const TRACK: TrackNode[] = buildTrack(MATRIZES_UNITS, {
  1: [{ kind: 'exercise', id: 'ex-boss' }],
})

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  return isNodeUnlockedIn(TRACK, nodeId, completedNodeIds)
}
