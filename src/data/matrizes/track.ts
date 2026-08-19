import { MATRIZES_UNITS } from './units'

export type TrackNode = { kind: 'lesson' | 'exercise'; id: string }

function buildTrack(): TrackNode[] {
  const nodes: TrackNode[] = []
  for (const unit of MATRIZES_UNITS) {
    for (const lesson of unit.lessons) {
      nodes.push({ kind: 'lesson', id: lesson.id })
      nodes.push({ kind: 'exercise', id: lesson.exerciseSetId })
    }
    if (unit.number === 1) {
      nodes.push({ kind: 'exercise', id: 'ex-boss' })
    }
  }
  return nodes
}

export const TRACK: TrackNode[] = buildTrack()

export function isNodeUnlocked(nodeId: string, completedNodeIds: Record<string, true>): boolean {
  const idx = TRACK.findIndex((n) => n.id === nodeId)
  if (idx <= 0) return true
  const prev = TRACK[idx - 1]
  return Boolean(completedNodeIds[prev.id])
}
