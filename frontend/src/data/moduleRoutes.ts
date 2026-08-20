const MODULE_HUB_HASH: Record<string, string> = {
  matrizes: '#modulos',
  'conceitos-basicos': '#basicos',
}

export function moduleHubHash(moduleId: string): string {
  return MODULE_HUB_HASH[moduleId] ?? '#modulos'
}
