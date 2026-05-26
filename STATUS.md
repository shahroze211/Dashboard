# Status

**Last updated:** 2026-05-26

## Built

All 5 modules shipped. v1 is feature-complete.

- **Foundation** — Next.js 14 App Router, TypeScript strict, Tailwind, hand-rolled shadcn, Drizzle, Vitest, ESLint, edge middleware password gate.
- **App shell** — root layout, sidebar nav, theme provider (dark default), shared `<PageHeader>`, `<EmptyState>`, `<Progress>`, route-level `error.tsx` / `not-found.tsx`.
- **Dashboard home (`/`)** — widget grid wired to all five modules; live counts and "next" hints.
- **Jobs (`/jobs`)** — list, URL-driven search + multi-select status filter, inline status edit, add/edit dialog, delete confirm.
- **Deadlines (`/deadlines`)** — grouped by Overdue / Today / This week / Later / Done, checkbox toggle, add/edit dialog, delete confirm.
- **Goals (`/goals`)** — grouped by timeframe (Year / Quarter / Month), progress bar with optimistic +1 / −1, mark-done toggle, add/edit dialog.
- **Gym (`/gym`)** — "Last performed" lookup row per unique exercise, history grouped by day, add/edit dialog.
- **Nutrition (`/nutrition`)** — date navigator (prev / today / next + date picker), macro summary with progress bars vs. targets, food log, OpenFoodFacts barcode lookup in the add dialog.
- **Tests** — Vitest, 35/35 passing across the five modules.
- **Seed data** — `pnpm db:seed` populates realistic sample data across every table for instant screenshots.

## Definition of done — checked

- [x] `pnpm typecheck` passes with zero errors
- [x] `pnpm lint` passes with zero warnings
- [x] `pnpm test` — 35/35 pass
- [ ] Manually tested the happy path in browser — *requires Supabase setup; user task below*

## In progress

_(nothing — v1 complete)_

## Next up (v2 ideas, not committed)

- Resend reminder cron — defer until a verified domain is in hand.
- Recharts visualizations on dashboard — application velocity over time, gym volume by week, calorie 7-day trend.
- Per-target nutrition macros editable in-app (today they live in `src/lib/constants.ts`).
- Mobile polish pass.

## Blocked

_(nothing)_

## What the user needs to do next

To run locally:

1. Create a free [Supabase](https://supabase.com) project.
2. Copy `.env.example` → `.env.local` and fill in `DATABASE_URL`, `DIRECT_URL`, `APP_PASSWORD`.
3. ```bash
   pnpm db:push        # pushes schema for all 5 modules
   pnpm db:seed        # optional — populates realistic sample data
   pnpm dev            # http://localhost:3000
   ```

To deploy:

1. Push to GitHub (done — github.com/shahroze211/Dashboard).
2. Import on Vercel; set `DATABASE_URL`, `DIRECT_URL`, `APP_PASSWORD`.
3. First deploy runs `pnpm build`.

## Decisions log

- **2026-05-26** — Dropped Vercel Password Protection in favor of edge middleware + env-var password. Password Protection is Pro-tier; this project is on Hobby.
- **2026-05-26** — Module build order biased to fresh-grad portfolio purpose: `jobs` first, then `deadlines`, `goals`, `gym`, `nutrition`.
- **2026-05-26** — Deferred Resend reminder cron to v2 (needs a verified domain).
- **2026-05-26** — Hand-rolled shadcn components instead of using the CLI — keeps the components reviewable in-repo.
- **2026-05-26** — User explicitly waived "one module per session" rule from CLAUDE.md to ship a complete v1 in one sitting (portfolio priority). Documented for posterity; the rule is restored for v2 work.
- **2026-05-26** — Nutrition macros stored as `double precision` (number, not numeric/string) for simpler arithmetic in widgets and summaries.
- **2026-05-26** — OpenFoodFacts integration: server-side fetch only, 1h cache, by barcode (no search-by-name in v1).
