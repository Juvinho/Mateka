import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env (or run `npm run db:up` first) before running db tests.',
  )
}

export const prisma = new PrismaClient()
