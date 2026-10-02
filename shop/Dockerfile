# syntax=docker/dockerfile:1

FROM node:24-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@11
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Full dependencies and source: used to build, and to run migrations.
FROM deps AS source
COPY . .

# One-off container for `drizzle-kit migrate` against the shop-owned tables.
FROM source AS migrate
CMD ["pnpm", "db:migrate"]

FROM source AS build
# The build never talks to the database, but importing the db module needs a URL.
ENV DATABASE_URL=postgres://build:build@localhost:5432/build
RUN pnpm build

FROM node:24-slim AS shop
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
