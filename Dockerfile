# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias (incluye devDependencies para compilar Angular)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código y compilar (browser + server)
COPY . .
RUN npm run build:localize:prod

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Instalar solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar artefactos compilados
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Ejecutar SSR
CMD ["node", "dist/nahu-dev-site-v2/server/server.mjs"]