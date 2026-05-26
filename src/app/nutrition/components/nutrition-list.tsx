import { format } from "date-fns"
import { EmptyState } from "@/components/shared/empty-state"
import type { NutritionEntry } from "../types"
import { NutritionRowActions } from "./nutrition-row-actions"

export function NutritionList({ entries }: { entries: NutritionEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Nothing logged for this day"
        description="Add food with the button above."
      />
    )
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex items-center gap-3 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{e.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {Math.round(e.calories)} kcal · P {Math.round(e.protein)}{" "}
              · C {Math.round(e.carbs)} · F {Math.round(e.fat)}g
              {e.servingSize ? ` · ${e.servingSize}` : ""} ·{" "}
              {format(e.loggedAt, "h:mm a")}
            </p>
          </div>
          <NutritionRowActions entry={e} />
        </li>
      ))}
    </ul>
  )
}
