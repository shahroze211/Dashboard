import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { desc, gte } from "drizzle-orm"
import { db } from "@/db"
import { gymEntries } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistanceToNowStrict } from "date-fns"

async function getSummary() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recent = await db
    .select({ performedAt: gymEntries.performedAt })
    .from(gymEntries)
    .where(gte(gymEntries.performedAt, sevenDaysAgo))

  const sessionDays = new Set(
    recent.map((r) => r.performedAt.toISOString().slice(0, 10))
  )

  const [latest] = await db
    .select({ performedAt: gymEntries.performedAt })
    .from(gymEntries)
    .orderBy(desc(gymEntries.performedAt))
    .limit(1)

  return {
    weekSessions: sessionDays.size,
    lastWorkout: latest?.performedAt ?? null,
  }
}

export async function GymWidget() {
  const { weekSessions, lastWorkout } = await getSummary()

  return (
    <Link href="/gym" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Gym</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {!lastWorkout ? (
            <p className="text-sm text-muted-foreground">
              No workouts logged yet.
            </p>
          ) : (
            <>
              <p className="text-sm">
                {weekSessions === 0
                  ? "0 sessions this week"
                  : `${weekSessions} session${weekSessions === 1 ? "" : "s"} this week`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last workout {formatDistanceToNowStrict(lastWorkout)} ago
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
