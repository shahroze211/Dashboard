# Status

**Last updated:** 2026-05-26

## Built

- **Foundation** — Next.js 14 App Router, TypeScript (strict), Tailwind, shadcn (hand-rolled components, no CLI dependency), Drizzle, Vitest, ESLint, edge middleware password gate.
- **App shell** — root layout, sidebar nav, theme provider (dark default), `<PageHeader>`, `<EmptyState>`, `<PlaceholderWidget>`, route-level `error.tsx` and `not-found.tsx`.
- **Dashboard home (`/`)** — widget grid with the real `JobsWidget` and honest "coming soon" placeholders for the other four modules.
- **Jobs module (`/jobs`)** — full CRUD: list view (search + multi-select status filter via URL params), inline status edit, add/edit dialog (react-hook-form + zod), delete confirm, dashboard widget showing pipeline counts and last-application relative date.
- **Tests** — Vitest with 9 passing tests on `jobInputSchema`.
- **Seed data** — `pnpm db:seed` populates ~15 realistic sample applications across all statuses.

## Definition of done — checked

- [x] `pnpm typecheck` passes with zero errors
- [x] `pnpm lint` passes with zero warnings
- [x] `pnpm test` — 9/9 pass
- [ ] Manually tested the happy path in browser — *requires Supabase setup; user task below*

## In progress

_(nothing — first module shipped)_

## Next up (in order)

1. `deadlines`
2. `goals`
3. `gym`
4. `nutrition`
5. v2: Resend reminder cron + (optional) Recharts visualizations on dashboard

## Blocked

_(nothing)_

## What the user needs to do next

To run locally:

1. Create a free [Supabase](https://supabase.com) project.
2. Copy the **pooled** and **direct** connection strings into `.env.local` (use `.env.example` as a template).
3. Pick any value for `APP_PASSWORD` (or leave blank to bypass auth in dev).
4. Run:
   ```bash
   pnpm db:push       # pushes the schema to Supabase
   pnpm db:seed       # optional — populates sample applications for screenshots
   pnpm dev           # http://localhost:3000
   ```

To deploy:

1. Push the repo to GitHub.
2. Import into Vercel; set `DATABASE_URL`, `DIRECT_URL`, and `APP_PASSWORD` in the Vercel project settings.
3. First deploy uses `pnpm build` (already wired).

## Decisions log

- **2026-05-26** — Dropped Vercel Password Protection in favor of edge middleware + env-var password. Password Protection is Pro-tier; this project deploys on Hobby.
- **2026-05-26** — Module build order: `jobs` first. Most directly relevant to the portfolio purpose (fresh-grad job-hunting).
- **2026-05-26** — Deferred Resend reminder cron to v2. Schema stays in place. Requires verified domain — not worth blocking v1 on.
- **2026-05-26** — Added Vitest to the stack with ≥3 server-action / schema tests required per module.
- **2026-05-26** — `pnpm` installed via `npm install -g pnpm` (corepack not used since simpler).
- **2026-05-26** — Wrote shadcn components by hand instead of using the `shadcn` CLI. Reason: avoids needing the CLI's interactive prompts and keeps the components reviewable in-repo.
- **2026-05-26** — `db/index.ts` requires `DATABASE_URL` at module load. If unset, dynamic pages will error — handled by route-level `error.tsx`.
