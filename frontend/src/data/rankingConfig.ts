/**
 * rankingConfig.ts
 *
 * Defines per-module reward tiers for the top-3 positions.
 *
 * Each module awards exclusive stickers (figurinhas exclusivas) for the user's
 * profile and forum, acting as visual recognition of their performance.
 *
 * To add, change, or remove rewards for a module, edit this file.
 * If a new module is added in the future, it is automatically supported
 * with default stickers via `getModuleRewardConfig`.
 */

import { BASICOS_MODULE_CONFIG } from './basicos/moduleConfig'
import { MATRIZES_MODULE_CONFIG } from './matrizes/moduleConfig'
import { PRECALCULO_MODULE_CONFIG } from './precalculo/moduleConfig'
import { SISTEMAS_MODULE_CONFIG } from './sistemas/moduleConfig'
import { GEOMETRIA_MODULE_CONFIG } from './geometria/moduleConfig'
import { PLANA_MODULE_CONFIG } from './plana/moduleConfig'
import { ESPACIAL_MODULE_CONFIG } from './espacial/moduleConfig'

export type RewardTier = {
  position: 1 | 2 | 3
  label: string
  description: string
  icon: string
  type: 'current-holder' | 'achievement'
  rewardType: 'sticker-and-tag'
  integrationReady: boolean
}

export type ModuleRewardConfig = {
  moduleId: string
  moduleName: string
  icon: string
  badge: string
  tiers: RewardTier[]
}

export const KNOWN_MODULE_CONFIGS = [
  BASICOS_MODULE_CONFIG,
  MATRIZES_MODULE_CONFIG,
  PRECALCULO_MODULE_CONFIG,
  SISTEMAS_MODULE_CONFIG,
  GEOMETRIA_MODULE_CONFIG,
  PLANA_MODULE_CONFIG,
  ESPACIAL_MODULE_CONFIG,
]

export const MODULE_REWARD_CONFIGS: ModuleRewardConfig[] = [
  {
    moduleId: 'conceitos-basicos',
    moduleName: 'Conceitos Básicos',
    icon: '∑',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Mago dos Fundamentos',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Conceitos Básicos.',
        icon: '🌟',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Ás da Aritmética',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Conceitos Básicos.',
        icon: '⭐',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Base Sólida',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Conceitos Básicos.',
        icon: '✨',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'matrizes',
    moduleName: 'Matrizes',
    icon: '[A]',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Mestre das Matrizes',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Matrizes.',
        icon: '👑',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Operador Linear',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Matrizes.',
        icon: '⚡',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Determinante Rápido',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Matrizes.',
        icon: '💠',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'pre-calculo',
    moduleName: 'Pré-Cálculo',
    icon: 'f(x)',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Soberano das Funções',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Pré-Cálculo.',
        icon: '📈',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Explorador de Limites',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Pré-Cálculo.',
        icon: '🔍',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Analista Gráfico',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Pré-Cálculo.',
        icon: '📊',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'sistemas-lineares',
    moduleName: 'Sistemas Lineares',
    icon: 'Ax=b',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Resolutor Supremo',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Sistemas Lineares.',
        icon: '🎯',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Estrategista de Cramer',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Sistemas Lineares.',
        icon: '🧠',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Mestre do Escalonamento',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Sistemas Lineares.',
        icon: '📐',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'geometria-analitica',
    moduleName: 'Geometria Analítica',
    icon: '(x,y)',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Navegador do Plano',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Geometria Analítica.',
        icon: '🧭',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Vetor Imparável',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Geometria Analítica.',
        icon: '🏹',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Mapeador Cartesiano',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Geometria Analítica.',
        icon: '📍',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'geometria-plana',
    moduleName: 'Geometria Plana',
    icon: '△○',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Arquiteto Euclidiano',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Geometria Plana.',
        icon: '🏛️',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Geômetra Notável',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Geometria Plana.',
        icon: '📏',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Mestre dos Triângulos',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Geometria Plana.',
        icon: '📐',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
  {
    moduleId: 'geometria-espacial',
    moduleName: 'Geometria Espacial',
    icon: '⬡³',
    badge: 'Ensino Médio',
    tiers: [
      {
        position: 1,
        label: 'Figurinha: Mestre das 3 Dimensões',
        description: 'Figurinha exclusiva para perfil e fórum do 1º colocado em Geometria Espacial.',
        icon: '🔮',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: 'Figurinha: Calculador de Volumes',
        description: 'Figurinha exclusiva para perfil e fórum do 2º colocado em Geometria Espacial.',
        icon: '📦',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: 'Figurinha: Poliedro Perfeito',
        description: 'Figurinha exclusiva para perfil e fórum do 3º colocado em Geometria Espacial.',
        icon: '💎',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  },
]

/**
 * Returns reward config for any module. If a future module is not in
 * MODULE_REWARD_CONFIGS, it generates standard 1st/2nd/3rd place stickers automatically.
 */
export function getModuleRewardConfig(moduleId: string, fallbackName?: string): ModuleRewardConfig {
  const existing = MODULE_REWARD_CONFIGS.find((c) => c.moduleId === moduleId)
  if (existing) return existing

  const name = fallbackName || moduleId
  return {
    moduleId,
    moduleName: name,
    icon: '∑',
    badge: 'Módulo Mateka',
    tiers: [
      {
        position: 1,
        label: `Figurinha: Campeão de ${name}`,
        description: `Figurinha exclusiva para perfil e fórum do 1º colocado em ${name}.`,
        icon: '🥇',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 2,
        label: `Figurinha: Destaque de ${name}`,
        description: `Figurinha exclusiva para perfil e fórum do 2º colocado em ${name}.`,
        icon: '🥈',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
      {
        position: 3,
        label: `Figurinha: Consagrado em ${name}`,
        description: `Figurinha exclusiva para perfil e fórum do 3º colocado em ${name}.`,
        icon: '🥉',
        type: 'current-holder',
        rewardType: 'sticker-and-tag',
        integrationReady: true,
      },
    ],
  }
}

/**
 * Returns the reward tier config for a given module + position.
 */
export function getRewardTier(moduleId: string, position: number): RewardTier | undefined {
  const config = getModuleRewardConfig(moduleId)
  return config.tiers.find((t) => t.position === position)
}
