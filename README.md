# Dashboard

A calm personal life dashboard. No streaks. No notifications. No gamification. Just an honest read of how I'm doing.

> Built solo, end-to-end, as a fresh-grad portfolio project. Pair-programmed with [Claude Code](https://claude.ai/code) under an explicit set of guardrails — the full thinking lives in [`PROJECT.md`](./PROJECT.md) and [`CLAUDE.md`](./CLAUDE.md).

![dashboard screenshot placeholder](./docs/screenshot.png)

## What it does

Five modules sharing one dashboard home:

| Module | What it tracks |
|---|---|
| **Jobs** | Job applications — company, role, status, link, notes |
| **Deadlines** | Important dates: assignments, exams, application cut-offs, bills |
| **Goals** | Year/quarter/month goals with plain progress (no streaks) |
| **Gym** | Workout log with last-session lookup |
| **Nutrition** | Daily macros via OpenFoodFacts, targets vs. actuals |

## Why I built it

Most "personal productivity" tools optimize for engagement — streaks, badges, push notifications, red angry warnings. They turn your life into a slot machine. I wanted the opposite: a tool I'd actually want to open.

The constraint was building it **calm by default** — and producing something visibly polished, deployed, and used daily within weeks, not months.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL on Supabase |
| ORM | Drizzle |
| Forms | react-hook-form + zod (one schema, client + server) |
| Dates | date-fns |
| Charts | Recharts |
| Tests | Vitest |
| Auth | Edge middleware + env-var password (single user) |
| Deploy | Vercel Hobby + Vercel Cron |

## Running locally

```bash
corepack enable pnpm
pnpm install
cp .env.example .env.local        # fill in DATABASE_URL, DIRECT_URL, APP_PASSWORD
pnpm db:push
pnpm dev
```

Then visit `http://localhost:3000` and enter `APP_PASSWORD`.

## Architecture notes

- **Server Components by default.** `"use client"` only where state, effects, or browser APIs require it.
- **Server Actions for mutations.** API routes only for webhooks/cron.
- **One module = one folder.** Every module follows the same shape: `app/<module>/{page.tsx, actions.ts, types.ts, components/}`. Adding a sixth module is mechanical.
- **Schema-per-module.** `src/db/schema/<module>.ts`, all re-exported from a single index.
- **No raw SQL.** Drizzle's typed builders everywhere.

## Built with Claude Code

I (the human) define principles and module specs. Claude Code executes within those bounds. The principles are encoded in [`CLAUDE.md`](./CLAUDE.md) as binding rules — including a "deliberately not in this project" list that prevents scope creep.

Sessions follow a strict ritual: read `PROJECT.md` → read `STATUS.md` → read the relevant module spec → plan → build. **One module per session.** Nothing else.

The most interesting part of the experiment was watching how much architectural discipline an LLM holds when the rules are written down explicitly versus implied.

## Status

See [`STATUS.md`](./STATUS.md) for what's shipped, what's in flight, and what's next.
