import Link from "next/link"
import { ArrowUpRight, Apple } from "lucide-react"
import { and, gte, lte } from "drizzle-orm"
import { db } from "@/db"
import { nutritionEntries } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MacroRing } from "@/components/ui/macro-ring"
import { NUTRITION_TARGETS } from "@/lib/constants"
import { dayRangeUTC, todayKey } from "../lib/date"

async function getTodayTotals() {
  const { start, end } = dayRangeUTC(todayKey())
  const rows = await db
    .select({
      calories: nutritionEntries.calories,
      protein: nutritionEntries.protein,
      carbs: nutritionEntries.carbs,
      fat: nutritionEntries.fat,
    })
    .from(nutritionEntries)
    .where(
      and(
        gte(nutritionEntries.loggedAt, start),
        lte(nutritionEntries.loggedAt, end)
      )
    )

  return rows.reduce(
    (acc, r) => ({
      calories: acc.calories + r.calories,
      protein: acc.protein + r.protein,
      carbs: acc.carbs + r.carbs,
      fat: acc.fat + r.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export async function NutritionWidget() {
  const totals = await getTodayTotals()
  const empty =
    totals.calories === 0 &&
    totals.protein === 0 &&
    totals.carbs === 0 &&
    totals.fat === 0

  const rings = [
    { label: "Calories", actual: totals.calories, target: NUTRITION_TARGETS.calories },
    { label: "Protein", actual: totals.protein, target: NUTRITION_TARGETS.protein },
    { label: "Carbs", actual: totals.carbs, target: NUTRITION_TARGETS.carbs },
    { label: "Fat", actual: totals.fat, target: NUTRITION_TARGETS.fat },
  ]

  return (
    <Link href="/nutrition" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-3.5 w-3.5 text-muted-foreground" />
            Nutrition
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {empty ? (
            <p className="text-sm text-muted-foreground">
              Nothing logged today.
            </p>
          ) : (
            <div className="flex items-start gap-4">
              <MacroRing rings={rings} size={88} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {Math.round(totals.calories).toLocaleString()} /{" "}
                  {NUTRITION_TARGETS.calories.toLocaleString()} kcal
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  P {Math.round(totals.protein)} · C {Math.round(totals.carbs)} · F{" "}
                  {Math.round(totals.fat)}g
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  Today
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
