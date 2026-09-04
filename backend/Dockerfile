# ── Backend Dockerfile (Node.js 22 LTS) ────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Copy root and workspace package files for deterministic install
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY database/package.json ./database/
COPY frontend/package.json ./frontend/

# Install monorepo dependencies
RUN npm ci

# Copy database prisma schema and generate client
COPY database/prisma ./database/prisma
RUN npx prisma generate --schema=database/prisma/schema.prisma

# Copy backend source code and config
COPY backend/ ./backend/

WORKDIR /app/backend

ENV NODE_ENV=development
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "run", "dev"]
