const MODULE_HUB_HASH: Record<string, string> = {
  matrizes: '#modulos',
  'conceitos-basicos': '#basicos',
  'pre-calculo': '#pre-calculo',
  'sistemas-lineares': '#sistemas-lineares',
  'geometria-analitica': '#geometria-analitica',
  'geometria-plana': '#geometria-plana',
  'geometria-espacial': '#geometria-espacial',
}

export function moduleHubHash(moduleId: string): string {
  return MODULE_HUB_HASH[moduleId] ?? '#modulos'
}
