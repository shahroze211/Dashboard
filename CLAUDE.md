# CLAUDE.md

Personal life dashboard, built with Claude Code. Single user, deployed to Vercel.

## Before you touch code

Read these in order, every session:

1. **`PROJECT.md`** — what this is and why it exists. The principles in there override convenience.
2. **`STATUS.md`** — what's built, what's next, what's blocked.
3. **`specs/<module>.md`** — the spec for whatever module is in focus.

The vision lives in `PROJECT.md`. This file describes only *how* to build, not *what* or *why*. If a convention here conflicts with a principle in `PROJECT.md`, the principle wins — flag it and ask before deviating either way.

## Working agreement

- One module per session. Don't start the next before the current one is committed and verified.
- Plan before code. Surface assumptions and propose an approach before writing anything.
- Stay in scope. The spec's acceptance criteria is the contract.
- Ask before: adding dependencies, deviating from the module pattern, refactoring across modules, or changing the stack.
- Update `STATUS.md` when a module ships.
- Update this file when a new convention emerges.

## Product principles that bind technical decisions

These come from `PROJECT.md` and are not optional. Code that violates them is wrong even if it passes the tests:

- **Low friction or nothing.** If logging an action takes more than a few seconds, simplify. Smart defaults, minimal required fields, sensible auto-fill.
- **Calm, not noisy.** No red angry warnings, no streaks, no guilt notifications, no gamification. Data speaks plainly. A "3" is enough — it doesn't need an exclamation mark.
- **One screen tells me how I'm doing.** The dashboard home is the most important page. Every module contributes a summary widget to it.
- **Mine, not a product.** No social features, no sharing, no account system, no analytics, no telemetry.
- **Honest by default.** Show empty states truthfully. If there's no data, say so; don't hide the section to avoid looking empty.

## Stack

Do not deviate without updating this file.

- **Framework:** Next.js 14+ (App Router) + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle ORM + drizzle-kit
- **Forms:** react-hook-form + zod
- **Dates:** date-fns (never moment, never dayjs)
- **Charts:** Recharts
- **Auth:** Vercel Password Protection (no NextAuth, no Clerk)
- **Email:** Resend (reminder cron only)
- **Food data:** OpenFoodFacts API (no key needed)
- **Deploy:** Vercel Hobby + Vercel Cron
- **Package manager:** pnpm

## Folder structure

```
src/
  app/
    page.tsx                # Dashboard home (summary widget grid)
    layout.tsx              # Root layout with sidebar
    globals.css
    deadlines/
      page.tsx              # Module page
      components/           # Module-specific UI
      actions.ts            # Server actions
      types.ts              # Module types
    jobs/                   # Same shape as deadlines
    gym/
    nutrition/
    goals/
    api/
      cron/
        reminders/route.ts  # Vercel cron endpoint
  components/
    ui/                     # shadcn — DO NOT manually edit
    shared/                 # Sidebar, PageHeader, EmptyState, etc.
  db/
    index.ts                # Drizzle client
    schema/
      deadlines.ts          # One schema file per module
      jobs.ts
      gym.ts
      nutrition.ts
      goals.ts
      index.ts              # Re-exports everything
    seed.ts
  lib/
    utils.ts                # cn() and shared helpers
    constants.ts            # Categories, statuses, enums
specs/                      # Per-module specs
PROJECT.md
STATUS.md
CLAUDE.md
drizzle.config.ts
```

## Module pattern

Every module follows the same shape. When building a new one:

1. Define schema in `src/db/schema/<module>.ts`.
2. Re-export it from `src/db/schema/index.ts`.
3. Run `pnpm db:push` to sync.
4. Create `src/app/<module>/` with `page.tsx`, `actions.ts`, `types.ts`, `components/`.
5. Add sidebar nav link in `src/components/shared/sidebar.tsx`.
6. Add a summary widget to the dashboard home in `src/app/page.tsx`.
7. Update `STATUS.md`.

Don't invent new patterns. If a module legitimately needs to deviate, ask first.

## Conventions

### TypeScript

- Strict mode. Never use `any`. Use `unknown` and narrow.
- Don't annotate variables that infer correctly.
- Derive types from Drizzle: `type Deadline = typeof deadlines.$inferSelect`.

### React / Next.js

- Server Components by default. Add `"use client"` only for state, effects, or browser APIs.
- Server Actions for mutations. API routes only for webhooks and cron.
- Forms: react-hook-form + zod. Same schema validates on client and server.
- Loading states: shadcn `<Skeleton>` inside `<Suspense>`.
- Errors: route-level `error.tsx`.
- Empty states: shared `<EmptyState />` component.

### Styling

- Tailwind utility classes only. No `.module.css` files.
- `cn()` from `@/lib/utils` for conditional class names.
- Never write custom Button, Input, Dialog, Dropdown, Select, or Toast. Use shadcn.
- Dark mode default. Light mode via `next-themes`.

### Database

- One schema file per module.
- Every table includes `id` (serial primary key), `createdAt`, `updatedAt`.
- Use Drizzle's typed builders, not raw SQL.
- `pnpm db:push` only. No migration files committed.

### Imports

- Use the `@/` alias everywhere.
- Order: external packages → `@/` imports → relative imports → types.

### Naming

- Routes and folders: kebab-case.
- Components: PascalCase.tsx.
- Hooks: use-foo.ts exporting useFoo.
- Server actions: camelCase verbs (`createDeadline`, `updateJobStatus`).

### Dates

- Store as `timestamp with time zone`.
- Format with date-fns.
- Display in local timezone (single user, no timezone juggling).

## Commands

```bash
pnpm dev               # Dev server
pnpm build             # Production build
pnpm typecheck         # tsc --noEmit
pnpm lint              # next lint
pnpm db:push           # Sync schema to Supabase
pnpm db:studio         # Browse data
pnpm db:seed           # Run seed script
```

## Definition of done

Every task is done only when:

- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes
- [ ] Manually tested the happy path in the browser
- [ ] All acceptance criteria from the spec are met
- [ ] No console errors or warnings
- [ ] No new `any`, no `@ts-ignore`, no `eslint-disable` without a justifying comment

## Never

- Edit files under `src/components/ui/` manually (they're shadcn-managed).
- Install moment, dayjs, lodash, axios, or Prisma. Ask before adding any dependency.
- Build two modules in one session.
- Touch authentication code (Vercel Password Protection handles it).
- Commit `.env.local` or any file containing secrets.
- Add streaks, guilt notifications, gamification, or anything that violates the "calm, not noisy" principle.
- Add features not present in `PROJECT.md` or an approved spec. The "deliberately not in it" list in `PROJECT.md` is binding.

## Environment variables

```
DATABASE_URL=           # Supabase pooled connection
DIRECT_URL=             # Supabase direct connection (for drizzle-kit)
JSEARCH_API_KEY=        # Jobs Discover feed (JSearch via RapidAPI); empty = feed shows "not configured"
RESEND_API_KEY=         # Reminder emails
CRON_SECRET=            # Vercel Cron auth header
```

Local: `.env.local` (gitignored). Production: set in Vercel dashboard.
