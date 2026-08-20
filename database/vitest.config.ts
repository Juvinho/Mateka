import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    hookTimeout: 30000,
    testTimeout: 15000,
    // Integrity tests share one Postgres connection and insert/delete rows
    // that reference each other — run them serially to avoid cross-test
    // interference from concurrent transactions.
    fileParallelism: false,
  },
})
