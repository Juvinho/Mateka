export type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
}

export type AchievementInput = {
  totalCompletedNodes: number
  startedModuleCount: number
  hasPerfectSet: boolean
  bestStreak: number
  totalPoints: number
  totalEndlessAnswered: number
  hasCompletedModule: boolean
}

export function computeAchievements(input: AchievementInput): Achievement[] {
  return [
    {
      id: 'primeiro-passo',
      icon: '🎯',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira lição ou exercício.',
      unlocked: input.totalCompletedNodes > 0,
    },
    {
      id: 'multitarefa',
      icon: '🧭',
      title: 'Multitarefa',
      description: 'Comece os dois módulos disponíveis.',
      unlocked: input.startedModuleCount >= 2,
    },
    {
      id: 'precisao-total',
      icon: '💯',
      title: 'Precisão Total',
      description: 'Acerte 100% de um exercício.',
      unlocked: input.hasPerfectSet,
    },
    {
      id: 'consistencia',
      icon: '🔥',
      title: 'Consistência',
      description: 'Pratique 3 dias seguidos.',
      unlocked: input.bestStreak >= 3,
    },
    {
      id: 'semana-cheia',
      icon: '⚡',
      title: 'Semana Cheia',
      description: 'Pratique 7 dias seguidos.',
      unlocked: input.bestStreak >= 7,
    },
    {
      id: 'pontuador',
      icon: '🏆',
      title: 'Pontuador',
      description: 'Acumule 500 pontos.',
      unlocked: input.totalPoints >= 500,
    },
    {
      id: 'sem-limites',
      icon: '♾️',
      title: 'Sem Limites',
      description: 'Responda 50 questões no modo Endless.',
      unlocked: input.totalEndlessAnswered >= 50,
    },
    {
      id: 'modulo-completo',
      icon: '🎓',
      title: 'Módulo Concluído',
      description: 'Termine 100% de um módulo.',
      unlocked: input.hasCompletedModule,
    },
  ]
}
