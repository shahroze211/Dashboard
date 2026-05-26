import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NUTRITION_TARGETS } from "@/lib/constants"

export type MacroTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

function pct(actual: number, target: number) {
  return Math.min(100, (actual / target) * 100)
}

function format(n: number) {
  if (n >= 100) return Math.round(n).toLocaleString()
  return Math.round(n * 10) / 10
}

export function MacroSummary({ totals }: { totals: MacroTotals }) {
  const rows: Array<{
    key: keyof MacroTotals
    label: string
    unit: string
  }> = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
  ]

  return (
    <Card className="p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(({ key, label, unit }) => {
          const target = NUTRITION_TARGETS[key]
          const actual = totals[key]
          return (
            <div key={key}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span>
                  <span className="font-medium">{format(actual)}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    / {target.toLocaleString()} {unit}
                  </span>
                </span>
              </div>
              <Progress value={pct(actual, target)} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
