# Gym module spec

**Purpose:** Log workouts. See what I last did for any exercise (so I can progress).

## User stories

- Log a set in ≤5 seconds (exercise + sets + reps).
- See workouts grouped by day, newest first.
- See "last performed" for every exercise I've ever logged.

## Schema

```ts
gym_entries {
  id, exercise (required), sets (int), reps (int),
  weight (numeric, nullable), unit (kg|lbs, default kg),
  performedAt (timestamp), notes, createdAt, updatedAt
}
```

## Server actions

- `createGymEntry`, `updateGymEntry`, `deleteGymEntry`.

## UI

- **List page**
  - Top: "Last performed" panel — one row per unique exercise, most recent first.
  - Below: workouts grouped by day (most recent first). Each row: exercise · sets × reps @ weight · time.
- **Add/edit dialog** — exercise, sets, reps, weight, unit, performedAt, notes.

## Dashboard widget

```
Gym
─────
4 sessions this week
Last workout: 2 days ago
```

Empty: "No workouts logged yet."

## Acceptance criteria

- [ ] Add an entry with exercise + sets + reps — succeeds.
- [ ] List groups by day.
- [ ] "Last performed" shows one row per unique exercise.
- [ ] Widget reflects accurate weekly count.
- [ ] ≥3 Vitest tests on schema pass.
- [ ] `pnpm typecheck` & `pnpm lint` pass.
