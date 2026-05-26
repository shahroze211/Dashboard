import { format, formatDistanceToNowStrict } from "date-fns"
import {
  DEADLINE_CATEGORY_LABELS,
  type DeadlineCategory,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/shared/empty-state"
import type { Deadline } from "../types"
import { DeadlineCheckbox } from "./deadline-checkbox"
import { DeadlineRowActions } from "./deadline-row-actions"

type Group = {
  key: string
  title: string
  items: Deadline[]
  emphasize?: boolean
  faded?: boolean
}

function relative(date: Date, now: Date) {
  if (date.getTime() < now.getTime()) {
    return `${formatDistanceToNowStrict(date)} ago`
  }
  return `in ${formatDistanceToNowStrict(date)}`
}

export function DeadlinesList({ deadlines }: { deadlines: Deadline[] }) {
  if (deadlines.length === 0) {
    return (
      <EmptyState
        title="No deadlines yet"
        description="Add your first one with the button above."
      />
    )
  }

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)
  const weekEnd = new Date(todayEnd)
  weekEnd.setDate(weekEnd.getDate() + (7 - todayEnd.getDay()))
  weekEnd.setHours(23, 59, 59, 999)

  const groups: Group[] = [
    {
      key: "overdue",
      title: "Overdue",
      items: deadlines.filter(
        (d) => !d.done && d.dueAt.getTime() < todayStart.getTime()
      ),
      emphasize: true,
    },
    {
      key: "today",
      title: "Today",
      items: deadlines.filter(
        (d) =>
          !d.done &&
          d.dueAt.getTime() >= todayStart.getTime() &&
          d.dueAt.getTime() <= todayEnd.getTime()
      ),
    },
    {
      key: "thisWeek",
      title: "This week",
      items: deadlines.filter(
        (d) =>
          !d.done &&
          d.dueAt.getTime() > todayEnd.getTime() &&
          d.dueAt.getTime() <= weekEnd.getTime()
      ),
    },
    {
      key: "later",
      title: "Later",
      items: deadlines.filter(
        (d) => !d.done && d.dueAt.getTime() > weekEnd.getTime()
      ),
    },
    {
      key: "done",
      title: "Done",
      items: deadlines.filter((d) => d.done),
      faded: true,
    },
  ]

  return (
    <div className="space-y-8">
      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <section key={g.key}>
            <h2
              className={cn(
                "mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                g.emphasize && "text-foreground"
              )}
            >
              {g.title}{" "}
              <span className="ml-1 text-muted-foreground/60">
                {g.items.length}
              </span>
            </h2>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {g.items.map((d) => (
                <li
                  key={d.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    g.faded && "opacity-60",
                    g.emphasize && "italic"
                  )}
                >
                  <DeadlineCheckbox id={d.id} done={d.done} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm",
                        d.done && "line-through decoration-muted-foreground/40"
                      )}
                    >
                      {d.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {DEADLINE_CATEGORY_LABELS[d.category as DeadlineCategory]}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{format(d.dueAt, "MMM d, h:mm a")}</span>
                      <span aria-hidden>·</span>
                      <span>{relative(d.dueAt, now)}</span>
                    </div>
                  </div>
                  <DeadlineRowActions deadline={d} />
                </li>
              ))}
            </ul>
          </section>
        )
      )}
    </div>
  )
}
