import { and, asc, gte, lte } from "drizzle-orm"
import { db } from "@/db"
import { nutritionEntries } from "@/db/schema"
import { PageHeader } from "@/components/shared/page-header"
import { format } from "date-fns"
import { AddNutritionButton } from "./components/add-nutrition-button"
import { DateNavigator } from "./components/date-navigator"
import { MacroSummary, type MacroTotals } from "./components/macro-summary"
import { NutritionList } from "./components/nutrition-list"
import { dayRangeUTC, todayKey } from "./lib/date"

export const dynamic = "force-dynamic"

const KEY_RE = /^\d{4}-\d{2}-\d{2}$/

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const dayKey =
    searchParams.date && KEY_RE.test(searchParams.date)
      ? searchParams.date
      : todayKey()

  const { start, end } = dayRangeUTC(dayKey)

  const rows = await db
    .select()
    .from(nutritionEntries)
    .where(
      and(
        gte(nutritionEntries.loggedAt, start),
        lte(nutritionEntries.loggedAt, end)
      )
    )
    .orderBy(asc(nutritionEntries.loggedAt))

  const totals: MacroTotals = rows.reduce(
    (acc, r) => ({
      calories: acc.calories + r.calories,
      protein: acc.protein + r.protein,
      carbs: acc.carbs + r.carbs,
      fat: acc.fat + r.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Default new entries to noon on the selected day.
  const defaultLoggedAt = `${dayKey}T12:00`

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nutrition"
        description={`Showing ${format(start, "EEEE, MMMM d")}.`}
        actions={<AddNutritionButton defaultLoggedAt={defaultLoggedAt} />}
      />
      <div className="mb-6 flex justify-end">
        <DateNavigator value={dayKey} />
      </div>
      <div className="space-y-6">
        <MacroSummary totals={totals} />
        <NutritionList entries={rows} />
      </div>
    </div>
  )
}
