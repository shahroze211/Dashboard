import { asc } from "drizzle-orm"
import { db } from "@/db"
import { deadlines as deadlinesTable } from "@/db/schema"
import { getDeadlineTimings } from "@/lib/holidays"
import { PageHeader } from "@/components/shared/page-header"
import { DeadlinesList } from "./components/deadlines-list"
import { AddDeadlineButton } from "./components/add-deadline-button"

export const dynamic = "force-dynamic"

export default async function DeadlinesPage() {
  const rows = await db
    .select()
    .from(deadlinesTable)
    .orderBy(asc(deadlinesTable.dueAt))

  const timings = await getDeadlineTimings(rows)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Deadlines"
        description="What's due and when."
        actions={<AddDeadlineButton />}
      />
      <DeadlinesList deadlines={rows} timings={timings} />
    </div>
  )
}
