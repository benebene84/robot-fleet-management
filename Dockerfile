FROM node:24.22.3-alpine AS base
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile --ignore-scripts


# Create build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# Finalize image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S start -u 1001

COPY --from=builder /app/.output ./output

USER 1001:1001

EXPOSE 3000

ENV PORT=3000

CMD ["node", "output/server/index.mjs"]
