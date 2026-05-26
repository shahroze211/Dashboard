import { EmptyState } from "@/components/shared/empty-state"
import {
  GOAL_TIMEFRAMES,
  GOAL_TIMEFRAME_LABELS,
  type GoalTimeframe,
} from "@/lib/constants"
import type { Goal } from "../types"
import { GoalCard } from "./goal-card"

export function GoalsList({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="No goals yet"
        description="Add one with the button above."
      />
    )
  }

  const byTimeframe = new Map<GoalTimeframe, Goal[]>()
  for (const tf of GOAL_TIMEFRAMES) byTimeframe.set(tf, [])
  for (const g of goals) {
    byTimeframe.get(g.timeframe as GoalTimeframe)?.push(g)
  }

  return (
    <div className="space-y-8">
      {GOAL_TIMEFRAMES.map((tf) => {
        const items = byTimeframe.get(tf) ?? []
        if (items.length === 0) return null
        return (
          <section key={tf}>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {GOAL_TIMEFRAME_LABELS[tf]}
              <span className="ml-2 text-muted-foreground/60">{items.length}</span>
            </h2>
            <div className="space-y-3">
              {items.map((g) => (
                <GoalCard key={g.id} goal={g} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
