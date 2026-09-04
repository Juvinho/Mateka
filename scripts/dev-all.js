import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// 1. Garantir existência dos arquivos .env
const backendEnv = path.join(ROOT, 'backend', '.env')
const backendEnvEx = path.join(ROOT, 'backend', '.env.example')
if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvEx)) {
  fs.copyFileSync(backendEnvEx, backendEnv)
  console.log('[Mateka] backend/.env criado a partir de .env.example')
}

const dbEnv = path.join(ROOT, 'database', '.env')
const dbEnvEx = path.join(ROOT, 'database', '.env.example')
if (!fs.existsSync(dbEnv) && fs.existsSync(dbEnvEx)) {
  fs.copyFileSync(dbEnvEx, dbEnv)
  console.log('[Mateka] database/.env criado a partir de .env.example')
}

// 2. Verificar se o Docker está presente e tentar subir o Postgres
let dockerAvailable = false
try {
  execSync('docker --version', { stdio: 'ignore' })
  dockerAvailable = true
} catch {
  dockerAvailable = false
}

if (dockerAvailable) {
  console.log('[Mateka] Docker detectado. Inicializando container do banco Postgres...')
  try {
    execSync('npm run db:up', { cwd: ROOT, stdio: 'inherit' })
    console.log('[Mateka] Banco de dados Postgres ativo no container.')
  } catch (e) {
    console.warn('[Mateka] Aviso: Docker Desktop pode estar pausado ou iniciando. Prosseguindo com os serviços locais...')
  }
} else {
  console.log('[Mateka] Docker CLI não detectado no PATH do sistema.')
  console.log('[Mateka] Iniciando serviços integrados de Backend (API) e Frontend (Web)...')
}

// 3. Garantir que o Prisma Client está gerado
try {
  execSync('npx prisma generate --schema=database/prisma/schema.prisma', { cwd: ROOT, stdio: 'ignore' })
} catch {
  // prossegue normalmente se já estiver gerado
}

// 4. Iniciar Backend (porta 4000) e Frontend (porta 5173) simultaneamente
console.log('\n======================================================')
console.log('  MATEKA - AMBIENTE COMPLETO EM EXECUÇÃO             ')
console.log('======================================================')
console.log('  ➜ Backend API:  http://localhost:4000')
console.log('  ➜ Frontend Web: http://localhost:5173')
console.log('  ➜ Proxy Vite:   /api/* -> http://localhost:4000/api/*')
console.log('======================================================\n')

const child = spawn(
  'npx',
  ['concurrently', '-n', 'api,web', '-c', 'green,cyan', '"npm:dev:api"', '"npm:dev"'],
  { cwd: ROOT, stdio: 'inherit', shell: true }
)

child.on('exit', (code) => {
  process.exit(code || 0)
})

process.on('SIGINT', () => {
  child.kill('SIGINT')
})

process.on('SIGTERM', () => {
  child.kill('SIGTERM')
})
