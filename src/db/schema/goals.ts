import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const goalTimeframe = pgEnum("goal_timeframe", [
  "year",
  "quarter",
  "month",
])

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  timeframe: goalTimeframe("timeframe").notNull().default("month"),
  periodStart: date("period_start", { mode: "date" }).notNull(),
  target: integer("target"),
  progress: integer("progress").notNull().default(0),
  unit: text("unit"),
  notes: text("notes"),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
