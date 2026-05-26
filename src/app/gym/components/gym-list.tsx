import { format, formatDistanceToNowStrict } from "date-fns"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import type { GymEntry } from "../types"
import { GymRowActions } from "./gym-row-actions"

function formatSetRep(entry: GymEntry) {
  const weight =
    entry.weight != null ? ` @ ${entry.weight}${entry.unit}` : ""
  return `${entry.sets}×${entry.reps}${weight}`
}

export function GymList({ entries }: { entries: GymEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No workouts logged yet"
        description="Add your first one with the button above."
      />
    )
  }

  // Group by day key (YYYY-MM-DD)
  const byDay = new Map<string, GymEntry[]>()
  for (const e of entries) {
    const key = format(e.performedAt, "yyyy-MM-dd")
    const list = byDay.get(key)
    if (list) list.push(e)
    else byDay.set(key, [e])
  }

  // Last-performed: most recent entry per unique exercise
  const lastByExercise = new Map<string, GymEntry>()
  for (const e of entries) {
    const prev = lastByExercise.get(e.exercise.toLowerCase())
    if (!prev || prev.performedAt.getTime() < e.performedAt.getTime()) {
      lastByExercise.set(e.exercise.toLowerCase(), e)
    }
  }
  const recentLast = [...lastByExercise.values()]
    .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())
    .slice(0, 8)

  return (
    <div className="space-y-10">
      {recentLast.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Last performed
          </h2>
          <Card className="divide-y divide-border p-0">
            {recentLast.map((e) => (
              <div
                key={`last-${e.id}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <span className="truncate font-medium">{e.exercise}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatSetRep(e)} ·{" "}
                  {formatDistanceToNowStrict(e.performedAt)} ago
                </span>
              </div>
            ))}
          </Card>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          History
        </h2>
        <div className="space-y-6">
          {[...byDay.entries()].map(([day, items]) => (
            <div key={day}>
              <p className="mb-2 text-xs text-muted-foreground">
                {format(new Date(items[0].performedAt), "EEEE, MMM d")}
              </p>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {items.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {e.exercise}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatSetRep(e)} · {format(e.performedAt, "h:mm a")}
                        {e.notes ? ` · ${e.notes}` : ""}
                      </p>
                    </div>
                    <GymRowActions entry={e} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
