# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /usr/src/app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends ca-certificates curl openssl \
  && curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o /etc/ssl/certs/aws-rds-global-bundle.pem \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
ENV NODE_ENV=development

ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

ARG NPM_TOKEN=${NPM_TOKEN}
COPY .npmrc_ .npmrc
RUN test -n "$NPM_TOKEN" || (echo "NPM_TOKEN build arg is required to install private @bringit packages" && exit 1)
RUN npm ci && rm -f .npmrc
RUN npx prisma generate

FROM deps AS build

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
