# Deploying the shop

The shop runs on one server with Docker Compose. A push to `main` builds an
image, pushes it to GitHub's container registry and releases it on the server.

```
push to main ─► CI (types, lint, build) ─► Deploy
                                             ├─ build + push  ghcr.io/<owner>/<repo>:<sha>
                                             ├─ copy deploy/compose.yml and deploy/Caddyfile to the server
                                             ├─ run migrations for the shop-owned tables
                                             ├─ docker compose up -d
                                             └─ check that https://<domain>/login answers
```

## What runs on the server

| Service | Image | Reachable from outside |
| --- | --- | --- |
| `caddy` | `caddy:2` | yes, ports 80 and 443; gets and renews the certificate itself |
| `shop` | built by the Deploy workflow | no, only through Caddy |
| `postgres` | `postgres:17` | no |
| `chroma` | `chromadb/chroma` | no |
| `migrate` | built by the Deploy workflow | runs once per release, then exits |

Postgres and Chroma keep their data in Docker volumes, so a release never
touches it.

## One-time setup

### 1. The server

- Docker with the Compose plugin installed.
- A user that may run `docker` and that the workflow can log in as over SSH.
- Firewall open on 22, 80 and 443 only.
- DNS for your domain pointing at the server.
- A directory for the stack, for example `/opt/gamecommendo`, containing a `.env`
  file made from [`deploy/.env.example`](deploy/.env.example):

  ```sh
  mkdir -p /opt/gamecommendo && cd /opt/gamecommendo
  # copy deploy/.env.example here as .env, then fill it in
  chmod 600 .env
  ```

  Use a new `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), not the one from
  your machine.

### 2. A deploy key

On your machine:

```sh
ssh-keygen -t ed25519 -f gamecommendo-deploy -N "" -C "github-actions-deploy"
ssh-copy-id -i gamecommendo-deploy.pub <user>@<server>
```

The private key (`gamecommendo-deploy`) goes into a GitHub secret below. Delete
the local copy afterwards.

### 3. GitHub

Push this repository to GitHub, then add these under
**Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | server address |
| `VPS_USER` | the SSH user |
| `VPS_SSH_KEY` | the private deploy key, whole file |
| `VPS_PATH` | the stack directory, e.g. `/opt/gamecommendo` |
| `VPS_PORT` | SSH port; leave unset for 22 |
| `SITE_DOMAIN` | the domain, same as in the server's `.env` |

Application secrets (`OPENAI_API_KEY`, `STEAM_API_KEY`, the database password,
`BETTER_AUTH_SECRET`) live only in the server's `.env`. GitHub never sees them.

### 4. The data

A fresh server has an empty Postgres and an empty Chroma. The first release
creates the shop-owned tables (accounts, Library, Favourites, Dismissed) but the
Catalog has to be put there once. Either way, do the first release first so the
containers and volumes exist.

**Copy from your machine** (fast, no API calls):

```sh
# Game tables only, so local accounts stay local.
pg_dump "$DATABASE_URL" --data-only --no-owner \
  -t games -t screenshots -t genres -t platforms -t player_perspectives \
  -t game_modes -t themes -t keywords -t 'game_*' > games.sql
pg_dump "$DATABASE_URL" --schema-only --no-owner \
  -t games -t screenshots -t genres -t platforms -t player_perspectives \
  -t game_modes -t themes -t keywords -t 'game_*' > games-schema.sql

# On the server, in the stack directory:
docker compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB" < games-schema.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB" < games.sql
```

For Chroma, archive the local volume and unpack it into the server's
`chroma-data` volume while the `chroma` container is stopped.

**Or rebuild on the server**: publish Postgres and Chroma on `127.0.0.1` for the
duration, run Ingestion and the notebook against them as described in
[`db/README.md`](db/README.md) (`pnpm catalog:refresh`), then remove the
published ports again.

`public/game-map.json` is part of the image. Rebuild it locally
(`pnpm map:build`) and commit it whenever the Catalog changes.

## Releasing

- **Automatically**: push to `main`. Deploy starts when CI succeeds.
- **By hand**: Actions → Deploy → Run workflow.

Each release is tagged with its commit, so the server always runs an exact
version.

## Rolling back

On the server, in the stack directory:

```sh
SHOP_IMAGE=ghcr.io/<owner>/<repo>:<older-sha> docker compose up -d shop
```

Migrations are not rolled back. A release that changed a table needs its own
plan before going back.

## Looking at it

```sh
docker compose ps
docker compose logs -f shop
docker compose logs -f caddy
```

## Backups

Chroma and the Map can be rebuilt from the Catalog. Members and what they saved
cannot. Back up Postgres at least nightly:

```sh
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > backup-$(date +%F).sql.gz
```

## Before letting anyone in

- The Query palette and Steam sync are public endpoints that spend your OpenAI
  and Steam quota. Neither is rate-limited yet.
- There is no password reset or email verification.
