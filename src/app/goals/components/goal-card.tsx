import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Goal } from "../types"
import { periodLabel } from "../lib/period"
import { ProgressButton } from "./progress-button"
import { GoalRowActions } from "./goal-row-actions"

export function GoalCard({ goal }: { goal: Goal }) {
  return (
    <Card
      className={cn(
        "flex items-start gap-4 p-4",
        goal.done && "opacity-60"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={cn(
              "text-sm font-medium",
              goal.done && "line-through decoration-muted-foreground/40"
            )}
          >
            {goal.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground">
            {periodLabel(goal.timeframe, goal.periodStart)}
          </span>
        </div>
        {goal.target && goal.target > 0 ? (
          <div className="mt-3">
            <ProgressButton
              id={goal.id}
              progress={goal.progress}
              target={goal.target}
              unit={goal.unit}
            />
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            {goal.done ? "Completed" : "In progress"}
          </p>
        )}
        {goal.notes ? (
          <p className="mt-2 text-xs text-muted-foreground">{goal.notes}</p>
        ) : null}
      </div>
      <GoalRowActions goal={goal} />
    </Card>
  )
}
