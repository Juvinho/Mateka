import { PrismaClient } from '@prisma/client'

// Shared client — schema lives in /database/prisma, generated into the
// hoisted root node_modules (npm workspaces), so this resolves the same
// generated client the `database` workspace's seed/tests use.
export const prisma = new PrismaClient()
