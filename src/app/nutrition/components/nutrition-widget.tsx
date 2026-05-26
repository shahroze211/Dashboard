import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { and, gte, lte } from "drizzle-orm"
import { db } from "@/db"
import { nutritionEntries } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

  return (
    <Link href="/nutrition" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Nutrition</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {empty ? (
            <p className="text-sm text-muted-foreground">
              Nothing logged today.
            </p>
          ) : (
            <>
              <p className="text-sm">
                {Math.round(totals.calories).toLocaleString()} /{" "}
                {NUTRITION_TARGETS.calories.toLocaleString()} kcal
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                P {Math.round(totals.protein)} · C {Math.round(totals.carbs)} · F{" "}
                {Math.round(totals.fat)}g
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
