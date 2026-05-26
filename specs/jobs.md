# Jobs module spec

**Purpose:** Track job applications I've sent and where each one stands.

## User stories

- Add a new application in ≤5 seconds (company + role at minimum).
- See all applications at a glance, sortable by date and filterable by status.
- Update status as it moves: `applied → interviewing → offer | rejected | ghosted | withdrawn`.
- See a pipeline summary on the dashboard home (counts by status).

## Schema (`src/db/schema/jobs.ts`)

```ts
export const jobStatus = pgEnum("job_status", [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "ghosted",
  "withdrawn",
])

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  status: jobStatus("status").notNull().default("applied"),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
  link: text("link"),
  notes: text("notes"),
  salary: text("salary"),       // free-text; values vary too widely to type
  location: text("location"),
  source: text("source"),       // "linkedin" | "company-site" | "referral" | "other"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
```

Type alias: `type Job = typeof jobs.$inferSelect`.

## Server actions (`src/app/jobs/actions.ts`)

- `createJob(input)` — required: `company`, `role`. All else optional.
- `updateJob(id, input)` — full edit.
- `updateJobStatus(id, status)` — single-field flip from list row.
- `deleteJob(id)` — requires confirmation on the client.

All inputs validated by a shared zod schema (also used by react-hook-form on the client).

## Routes

- `GET /jobs` — list view.
- Dashboard widget — at `/` (home), summary card linking to `/jobs`.

## UI surface

- **List page**
  - Header: page title + "Add job" primary button (opens dialog).
  - Filter bar: status pills (multi-select), text search across `company` + `role`.
  - Table: company, role, status (inline dropdown), applied date, source, link icon, row actions (edit, delete).
  - Empty state: shared `<EmptyState />` with copy "No applications yet. Add your first one."
- **Add/edit dialog**
  - shadcn `<Dialog>` containing a react-hook-form.
  - Required: `company`, `role`. Optional: everything else.
  - Status defaults to `applied`. `appliedAt` defaults to today.
- **Status badges**
  - Grayscale tones only — no semantic green/red. Tone differences communicate state without alarm.
  - Mapping: `applied` (neutral), `interviewing` (slightly darker), `offer` (filled), `rejected` (muted strikethrough text), `ghosted` (muted italics), `withdrawn` (muted).

## Dashboard widget

Compact card. Shape:

```
Jobs                                 →
─────────────────────────────────────
8 applied  ·  2 interviewing  ·  1 offer
Last application: 3 days ago
```

Honest if empty: "No applications yet."

## Acceptance criteria

- [ ] Add a job with only `company` + `role` — succeeds.
- [ ] Add a job with all fields populated — succeeds.
- [ ] Edit a job via dialog — persists.
- [ ] Inline status change from list row — persists, no dialog needed.
- [ ] Delete a job — confirmation, then persists, list refreshes.
- [ ] Filter by status (multi-select pills) — narrows list.
- [ ] Search by company/role text — narrows list.
- [ ] Empty state shows when no jobs (or none matching filter).
- [ ] Dashboard widget reflects accurate counts and "last application" relative date.
- [ ] Logging a new application takes ≤3 seconds from a keyboard-only flow.
- [ ] ≥3 Vitest tests on server actions pass (create, status update, validation rejection).
- [ ] `pnpm typecheck` & `pnpm lint` pass.

## Out of scope (v2)

- Application timeline / per-event notes
- Interview scheduling
- Resume/cover letter version tracking
- Calendar integration
- CSV import/export
