import { asc, desc } from "drizzle-orm"
import { db } from "@/db"
import { goals as goalsTable } from "@/db/schema"
import { PageHeader } from "@/components/shared/page-header"
import { GoalsList } from "./components/goals-list"
import { AddGoalButton } from "./components/add-goal-button"

export const dynamic = "force-dynamic"

export default async function GoalsPage() {
  const rows = await db
    .select()
    .from(goalsTable)
    .orderBy(asc(goalsTable.done), desc(goalsTable.periodStart))

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Goals"
        description="What I'm working toward."
        actions={<AddGoalButton />}
      />
      <GoalsList goals={rows} />
    </div>
  )
}
