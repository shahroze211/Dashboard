# Deadlines module spec

**Purpose:** Track the dates I'd otherwise forget — assignments, exams, application cut-offs, bills.

## User stories

- Add a deadline in ≤5 seconds (title + due date).
- See what's overdue, due today, this week, later — all at a glance.
- Mark a deadline done with one click (no dialog).
- See a "next deadline" summary on the dashboard.

## Schema

```ts
deadlines {
  id, title (required), category (enum), dueAt (required),
  notes, done (bool, default false), createdAt, updatedAt
}
```

Categories: `assignment | exam | application | bill | other`.

## Server actions

- `createDeadline(input)` — required: `title`, `dueAt`.
- `updateDeadline(id, input)` — full edit.
- `toggleDeadlineDone(id, done)` — single-checkbox toggle from list.
- `deleteDeadline(id)`.

## UI surface

- **List page** — items grouped by section: Overdue, Today, This week, Later, Done. Empty sections are hidden. Each row has a checkbox, title, category chip, relative date, and an actions menu.
- **Add/edit dialog** — title + due date required; category, notes, done optional.

No red, no alarm. Overdue items are italic + muted, not aggressive.

## Dashboard widget

```
Deadlines                              →
3 today  ·  5 this week
Next: Spanish midterm — in 6h
```

Empty: "Nothing on the horizon."

## Acceptance criteria

- [ ] Add a deadline with only title + due date — succeeds.
- [ ] Items group correctly across Overdue / Today / This week / Later / Done.
- [ ] Checkbox toggles `done` without opening a dialog.
- [ ] Widget shows accurate counts and next-up.
- [ ] ≥3 Vitest tests on schema pass.
- [ ] `pnpm typecheck` & `pnpm lint` pass.
