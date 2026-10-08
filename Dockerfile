# ---------- Builder ----------
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:ui && npm run build:localize:prod

# ---------- Runner ----------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
# Vistas del servidor MCP (MCP Apps), compiladas por `npm run build:ui`; se leen del disco en runtime
COPY --from=builder /app/ui-dist ./ui-dist

EXPOSE 4000

# Ejecutar SSR
CMD ["node", "dist/nahu-dev-site-v2/server/server.mjs"]