import { asc, eq } from "drizzle-orm"
import { formatDistanceToNowStrict } from "date-fns"
import { db } from "@/db"
import { deadlines } from "@/db/schema"
import { HomeGreeting } from "@/components/shared/home-greeting"
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

export default async function DashboardHome() {
  const hint = await getNextDeadlineHint()
  return (
    <div className="mx-auto max-w-6xl">
      <HomeGreeting hint={hint} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <JobsWidget />
        <DeadlinesWidget />
        <GoalsWidget />
        <GymWidget />
        <NutritionWidget />
      </div>
    </div>
  )
}
