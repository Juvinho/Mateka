# ── Frontend Dockerfile (Vite + React 19) ──────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Copy root and workspace package files
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY database/package.json ./database/

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./frontend/

WORKDIR /app/frontend

ENV NODE_ENV=development

EXPOSE 5173

# Run Vite with --host to allow external/container access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
