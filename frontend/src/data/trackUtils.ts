import type { UnitContent } from './lessonTypes'

export type TrackNode = { kind: 'lesson' | 'exercise'; id: string }

/**
 * Flattens a module's units into the linear lesson→exercise sequence used to
 * gate unlocking. `extraNodesByUnit` appends bonus nodes (e.g. a unit-ending
 * challenge set with no lesson of its own) right after a given unit's
 * lesson/exercise pairs.
 */
export function buildTrack(units: UnitContent[], extraNodesByUnit?: Record<number, TrackNode[]>): TrackNode[] {
  const nodes: TrackNode[] = []
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      nodes.push({ kind: 'lesson', id: lesson.id })
      nodes.push({ kind: 'exercise', id: lesson.exerciseSetId })
    }
    const extra = extraNodesByUnit?.[unit.number]
    if (extra) nodes.push(...extra)
  }
  return nodes
}

export function isNodeUnlockedIn(track: TrackNode[], nodeId: string, completedNodeIds: Record<string, true>): boolean {
  const idx = track.findIndex((n) => n.id === nodeId)
  if (idx <= 0) return true
  const prev = track[idx - 1]
  return Boolean(completedNodeIds[prev.id])
}
