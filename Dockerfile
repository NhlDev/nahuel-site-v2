# ---------- Builder ----------
FROM node:20-alpine3.19 AS builder
WORKDIR /app

COPY package*.json ./
RUN apk update && apk upgrade && npm ci

COPY . .
RUN npm run build:localize:prod

# ---------- Runner ----------
FROM node:20-alpine3.19 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN apk update && apk upgrade && npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Ejecutar SSR
CMD ["node", "dist/nahu-dev-site-v2/server/server.mjs"]