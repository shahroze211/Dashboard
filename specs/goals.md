# Goals module spec

**Purpose:** Track year/quarter/month goals with simple, honest progress. No streaks.

## User stories

- Set a goal in ≤5 seconds (title + timeframe).
- Optional numeric target with a unit ("read 24 books").
- Increment progress by +1 with a single click.
- See active vs. done at a glance, grouped by timeframe.

## Schema

```ts
goals {
  id, title, timeframe (enum: year|quarter|month),
  periodStart (date), target (int, nullable), progress (int, default 0),
  unit (text, nullable), notes, done (bool), createdAt, updatedAt
}
```

## Server actions

- `createGoal`, `updateGoal`, `incrementGoalProgress(id, delta)`,
  `toggleGoalDone(id, done)`, `deleteGoal`.

## UI

- **List page** — sections by timeframe (Year, Quarter, Month).
  Each goal: title, period label (e.g. "2026" or "Q2 2026"), target/progress text,
  progress bar (if target), +1 button (if target), actions menu.
- **Empty state** — "No goals yet."

## Dashboard widget

```
Goals
─────
3 active
Closest: Read 24 books — 75%
```

Empty: "No goals yet."

## Acceptance criteria

- [ ] Add a goal with just title + timeframe.
- [ ] Add a goal with target + unit + progress.
- [ ] +1 increments without dialog.
- [ ] Done toggle hides goal from "active" count.
- [ ] ≥3 Vitest tests on schema pass.
- [ ] `pnpm typecheck` & `pnpm lint` pass.
