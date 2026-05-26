import {
  doublePrecision,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const nutritionEntries = pgTable("nutrition_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: doublePrecision("calories").notNull(),
  protein: doublePrecision("protein").notNull().default(0),
  carbs: doublePrecision("carbs").notNull().default(0),
  fat: doublePrecision("fat").notNull().default(0),
  servingSize: text("serving_size"),
  barcode: text("barcode"),
  loggedAt: timestamp("logged_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type NutritionEntry = typeof nutritionEntries.$inferSelect
export type NewNutritionEntry = typeof nutritionEntries.$inferInsert
