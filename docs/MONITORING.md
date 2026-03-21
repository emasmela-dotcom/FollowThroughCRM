# Monitoring & ops (Follow Thru CRM)

## Endpoints

| Route | Purpose |
|--------|---------|
| `GET /api/health` | **Liveness** — always returns 200 JSON if the app is up. No database. |
| `GET /api/ready` | **Readiness** — runs `SELECT 1` against Postgres. Returns **503** if DB is unreachable. |

Use `/api/health` for generic uptime pings. Use `/api/ready` before traffic cutover or to alert on DB outages.

## Vercel

- **Analytics**: `@vercel/analytics` is wired in `src/components/Analytics.tsx` (included from root layout). Enable **Web Analytics** in the Vercel project dashboard for the project linked to this repo.
- **Logs**: Vercel → Project → Logs (function + edge).

## Cron

`/api/cron/reminders` expects `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set.
