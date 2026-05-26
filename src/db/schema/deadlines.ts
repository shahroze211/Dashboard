import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const deadlineCategory = pgEnum("deadline_category", [
  "assignment",
  "exam",
  "application",
  "bill",
  "other",
])

export const deadlines = pgTable("deadlines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: deadlineCategory("category").notNull().default("other"),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  notes: text("notes"),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Deadline = typeof deadlines.$inferSelect
export type NewDeadline = typeof deadlines.$inferInsert
