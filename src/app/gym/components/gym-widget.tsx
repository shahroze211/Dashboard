import Link from "next/link"
import { ArrowUpRight, Dumbbell } from "lucide-react"
import { desc, gte } from "drizzle-orm"
import { db } from "@/db"
import { gymEntries } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sparkline } from "@/components/ui/sparkline"
import { formatDistanceToNowStrict } from "date-fns"

const TREND_WEEKS = 8

async function getSummary() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentWeek = await db
    .select({ performedAt: gymEntries.performedAt })
    .from(gymEntries)
    .where(gte(gymEntries.performedAt, sevenDaysAgo))

  const sessionDays = new Set(
    recentWeek.map((r) => r.performedAt.toISOString().slice(0, 10))
  )

  // Sessions per week, last TREND_WEEKS weeks (oldest → newest).
  const trendCutoff = new Date()
  trendCutoff.setHours(0, 0, 0, 0)
  trendCutoff.setDate(trendCutoff.getDate() - TREND_WEEKS * 7)
  const trendRows = await db
    .select({ performedAt: gymEntries.performedAt })
    .from(gymEntries)
    .where(gte(gymEntries.performedAt, trendCutoff))

  const buckets = new Array(TREND_WEEKS).fill(0)
  const seenPerWeek: Array<Set<string>> = Array.from(
    { length: TREND_WEEKS },
    () => new Set<string>()
  )
  for (const r of trendRows) {
    const diffDays = Math.floor(
      (r.performedAt.getTime() - trendCutoff.getTime()) / (1000 * 60 * 60 * 24)
    )
    const weekIndex = Math.min(TREND_WEEKS - 1, Math.floor(diffDays / 7))
    const dayKey = r.performedAt.toISOString().slice(0, 10)
    if (!seenPerWeek[weekIndex].has(dayKey)) {
      seenPerWeek[weekIndex].add(dayKey)
      buckets[weekIndex] += 1
    }
  }

  const [latest] = await db
    .select({ performedAt: gymEntries.performedAt })
    .from(gymEntries)
    .orderBy(desc(gymEntries.performedAt))
    .limit(1)

  return {
    weekSessions: sessionDays.size,
    lastWorkout: latest?.performedAt ?? null,
    trend: buckets,
  }
}

export async function GymWidget() {
  const { weekSessions, lastWorkout, trend } = await getSummary()

  return (
    <Link href="/gym" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" />
            Gym
          </CardTitle>
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
              <div className="mt-3">
                <Sparkline data={trend} width={220} height={28} />
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  Sessions / week · last {TREND_WEEKS}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
