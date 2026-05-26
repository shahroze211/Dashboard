import Link from "next/link"
import { ArrowUpRight, CalendarClock } from "lucide-react"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import { deadlines } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistanceToNowStrict } from "date-fns"

async function getSummary() {
  const all = await db
    .select()
    .from(deadlines)
    .where(eq(deadlines.done, false))
    .orderBy(asc(deadlines.dueAt))

  const now = new Date()
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)
  const weekEnd = new Date(todayEnd)
  weekEnd.setDate(weekEnd.getDate() + (7 - todayEnd.getDay()))
  weekEnd.setHours(23, 59, 59, 999)

  const today = all.filter((d) => d.dueAt.getTime() <= todayEnd.getTime())
  const week = all.filter(
    (d) =>
      d.dueAt.getTime() > todayEnd.getTime() &&
      d.dueAt.getTime() <= weekEnd.getTime()
  )
  const next = all[0] ?? null
  return { todayCount: today.length, weekCount: week.length, next }
}

export async function DeadlinesWidget() {
  const { todayCount, weekCount, next } = await getSummary()
  const total = todayCount + weekCount

  return (
    <Link href="/deadlines" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
            Deadlines
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {!next ? (
            <p className="text-sm text-muted-foreground">
              Nothing on the horizon.
            </p>
          ) : (
            <>
              <p className="text-sm">
                {todayCount > 0
                  ? `${todayCount} today  ·  ${weekCount} this week`
                  : weekCount > 0
                  ? `${weekCount} this week`
                  : total === 0
                  ? "Nothing this week"
                  : `${total} upcoming`}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                Next: {next.title} —{" "}
                {next.dueAt.getTime() < Date.now()
                  ? `${formatDistanceToNowStrict(next.dueAt)} ago`
                  : `in ${formatDistanceToNowStrict(next.dueAt)}`}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
