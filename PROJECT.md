# Dashboard

A personal life dashboard. One screen for the things I'd otherwise lose track of: job applications, deadlines, gym, nutrition, goals.

Single user. No accounts, no social, no sharing. Mine, not a product.

## Why this exists

Most "personal productivity" tools optimize for engagement: streaks, badges, push notifications, color-coded urgency. They turn your life into a slot machine. I wanted the opposite — a quiet, honest read of how I'm doing, and a way to log a thing in three seconds without ceremony.

This project is a portfolio piece **and** a tool I use. Both purposes must hold simultaneously. If a decision serves the portfolio but makes daily use worse, the portfolio loses.

## Product principles

These are binding. Code that violates them is wrong even if it passes tests.

- **Low friction or nothing.** Logging an action takes ≤3 seconds. Smart defaults, minimal required fields, sensible auto-fill. If a form makes me think, the form is wrong.
- **Calm, not noisy.** No red angry warnings. No streaks. No guilt notifications. No gamification. Data speaks plainly — a "3" doesn't need an exclamation mark. *(Exception, 2026-05-29: the dashboard **home** carries a bold animated hero for portfolio/landing impact — see deviations table. The "calm" rule still binds every module page and every interaction that touches my data.)*
- **One screen tells me how I'm doing.** The dashboard home is the most important page. Every module contributes a summary widget.
- **Mine, not a product.** No social features, no sharing, no account system, no analytics, no telemetry.
- **Honest by default.** Empty states show emptiness. If there's no data, say so — don't hide the section to look fuller.

## Modules (in build order)

Each module follows the same shape. `specs/<module>.md` defines its contract.

1. **`jobs`** — Job application tracker. Company, role, status, dates, link, notes. *Built first because I'm applying to 200+ roles and a spreadsheet stopped scaling.*
2. **`deadlines`** — Important dates and what they're for. Assignments, exams, application cut-offs, bills.
3. **`goals`** — Year/quarter/month goals with simple progress. No "habit streaks".
4. **`gym`** — Workout log. Exercise, sets, reps, weight, date. Last-session lookup.
5. **`nutrition`** — Daily food log with macros via OpenFoodFacts. Targets vs. actuals, no shame.

Build order can shift but new modules must follow the existing pattern — see `CLAUDE.md`.

## Deliberately not in this project

Items below are **binding rejections**, not "maybe later". To add one, the rejection must be removed from this list first, with a written reason.

- Multi-user accounts, sharing, comments, social features
- Push notifications, mobile app, native install
- "Streaks", badges, achievements, levels, XP — any gamification
- Public read URLs, embedded widgets
- AI features that nudge behavior ("you should do X today")
- Analytics, telemetry, usage tracking of any kind
- Auto-import from MyFitnessPal / Strava / LinkedIn / etc.

## Success criteria

- Logging any action takes ≤3 seconds end-to-end
- Dashboard home loads in under 500ms
- I use it daily for ≥4 weeks without manual recovery work
- A reader of the README understands the *thinking*, not just the stack

## Deviations from initial plan (documented for posterity)

| Decision | Original | Now | Why |
|---|---|---|---|
| Auth | Vercel Password Protection | Edge middleware + `APP_PASSWORD` env var | Password Protection is Pro-tier; this project lives on Hobby |
| Module order | (unspecified, deadlines first in example) | jobs → deadlines → goals → gym → nutrition | `jobs` is the strongest first-shipped story given the project's portfolio purpose |
| Reminder emails (Resend) | v1 | Deferred to v2 | Requires verified domain; not worth blocking v1 launch |
| Tests | Not in DoD | Vitest, ≥3 server-action tests per module | Cheap signal that removes a reviewer's easiest criticism |
| Home aesthetic | "Calm, not noisy" everywhere | Bold animated hero (floating image, parallax, gradient mesh, animated counters) on the **home page only** | Owner decision 2026-05-29: portfolio/LinkedIn impact. The hero is a presentational landing band above the widgets; it stores nothing, nudges nothing, tracks nothing. Module pages and all data interactions stay calm. |
| External APIs | OpenFoodFacts only | + Nager.Date (deadlines), wger (gym), OpenFoodFacts search (nutrition), favicon service (job logos) | Owner decision 2026-05-29: enrich modules with keyless, server-cached lookups. None nudge behavior, none auto-import a feed, none add telemetry — so the binding rejections still hold. |
