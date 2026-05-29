import { asc, eq, gte, sql } from "drizzle-orm"
import { formatDistanceToNowStrict } from "date-fns"
import { db } from "@/db"
import { deadlines, goals, gymEntries, jobs } from "@/db/schema"
import { Hero, type HeroStat } from "@/components/shared/hero"
import { JobsWidget } from "./jobs/components/jobs-widget"
import { DeadlinesWidget } from "./deadlines/components/deadlines-widget"
import { GoalsWidget } from "./goals/components/goals-widget"
import { GymWidget } from "./gym/components/gym-widget"
import { NutritionWidget } from "./nutrition/components/nutrition-widget"

export const dynamic = "force-dynamic"

async function getNextDeadlineHint(): Promise<string | undefined> {
  const [next] = await db
    .select({ title: deadlines.title, dueAt: deadlines.dueAt })
    .from(deadlines)
    .where(eq(deadlines.done, false))
    .orderBy(asc(deadlines.dueAt))
    .limit(1)
  if (!next) return undefined
  const due = next.dueAt
  const phrase =
    due.getTime() < Date.now()
      ? `${formatDistanceToNowStrict(due)} overdue`
      : `in ${formatDistanceToNowStrict(due)}`
  const shortTitle =
    next.title.length > 40 ? next.title.slice(0, 37) + "…" : next.title
  return `${shortTitle} — ${phrase}`
}

async function getHeroStats(): Promise<HeroStat[]> {
  const weekAgo = new Date()
  weekAgo.setHours(0, 0, 0, 0)
  weekAgo.setDate(weekAgo.getDate() - 6)

  const count = sql<number>`count(*)::int`
  const [[jobsRow], [deadlinesRow], [goalsRow], [gymRow]] = await Promise.all([
    db.select({ n: count }).from(jobs),
    db.select({ n: count }).from(deadlines).where(eq(deadlines.done, false)),
    db.select({ n: count }).from(goals).where(eq(goals.done, false)),
    db.select({ n: count }).from(gymEntries).where(gte(gymEntries.performedAt, weekAgo)),
  ])

  return [
    { label: "Applications", value: jobsRow?.n ?? 0 },
    { label: "Open deadlines", value: deadlinesRow?.n ?? 0 },
    { label: "Active goals", value: goalsRow?.n ?? 0 },
    { label: "Sessions · 7d", value: gymRow?.n ?? 0 },
  ]
}

export default async function DashboardHome() {
  const [hint, stats] = await Promise.all([getNextDeadlineHint(), getHeroStats()])
  const widgets = [
    <JobsWidget key="jobs" />,
    <DeadlinesWidget key="deadlines" />,
    <GoalsWidget key="goals" />,
    <GymWidget key="gym" />,
    <NutritionWidget key="nutrition" />,
  ]
  return (
    <div className="mx-auto max-w-6xl">
      <Hero hint={hint} stats={stats} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget, i) => (
          <div
            key={widget.key}
            className="h-full animate-fade-in-up [&>a]:h-full"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            {widget}
          </div>
        ))}
      </div>
    </div>
  )
}
