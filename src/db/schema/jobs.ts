import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

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
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  link: text("link"),
  notes: text("notes"),
  salary: text("salary"),
  location: text("location"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert
