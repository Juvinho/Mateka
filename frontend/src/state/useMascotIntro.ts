import { useOneTimeFlag } from './useOneTimeFlag'

export function useMascotIntro() {
  const { hasSeen, markSeen } = useOneTimeFlag('mateka:matrizes:introSeen')
  return { hasSeenIntro: hasSeen, markIntroSeen: markSeen }
}
