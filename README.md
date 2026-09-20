# Social Stock Market — Fantasy Trading on GitHub Developers

Gamified platform: buy/sell shares of developers with $CLOUT (virtual currency). Price = trading demand + real GitHub activity.

## Quick start
```bash
cp apps/api/.env.example apps/api/.env   # edit secrets
cp packages/db/.env.example packages/db/.env
bun install
bun run infra:up
bun run db:migrate
bun run db:codegen
bun --filter @repo/api dev
```

- API: http://localhost:3002 — Docs: /docs — OpenAPI: /openapi.json
- Postgres: localhost:5433, Redis: localhost:6381 (non-default ports to avoid collision)

## Layout
```
apps/api       Hono + @hono/zod-openapi (trading, portfolio, IPO, shorts, auth)
apps/web       Next.js 16 + React 19 + Tailwind v4
apps/worker    GH Archive ingester, hot-tier poller, index computer, settler
packages/core  money math, curve math, index math (pure, no I/O)
packages/db    Kysely types + hand-written SQL migrations
```

## Spec
See `chat.md` in parent dir for full spec. Money = BIGINT minor units (1 CLOUT = 100 units). Curve k=1 exact BigInt math.
