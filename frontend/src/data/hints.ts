import type { Difficulty } from './exerciseTypes'

// Generic, difficulty-scaled hints — not written per-question. With 400+
// exercises across both modules, authoring a bespoke hint for each one isn't
// worth it; these cover every exercise instantly and still read as genuinely
// useful nudges rather than a generic "try harder" placeholder.
const HINTS_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: [
    'Releia o enunciado com calma — a resposta costuma estar mais perto do que parece.',
    'Elimina primeiro as alternativas que você tem certeza que estão erradas.',
    'Se envolve conta, refaz o cálculo num rascunho antes de escolher.',
  ],
  medium: [
    'Resolve passo a passo, sem pular etapas — é mais fácil errar quando se tenta ir direto pro resultado.',
    'Confere se você não trocou um sinal ou uma operação no meio da conta.',
    'Não tem problema revisar a lição de novo antes de tentar essa questão outra vez.',
  ],
  hard: [
    'Quebra o problema em partes menores — resolve um pedaço de cada vez.',
    'Desconfia de alternativas "quase certas": costumam ser pegadinha de sinal ou de ordem de operação.',
    'Questões difíceis geralmente combinam duas ideias mais simples — tenta identificar cada uma separadamente.',
  ],
}

export function pickHint(difficulty: Difficulty, seed: string): string {
  const pool = HINTS_BY_DIFFICULTY[difficulty]
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return pool[hash % pool.length]
}
