import { desc } from "drizzle-orm"
import { db } from "@/db"
import { gymEntries as gymTable } from "@/db/schema"
import { PageHeader } from "@/components/shared/page-header"
import { GymList } from "./components/gym-list"
import { AddGymEntryButton } from "./components/add-gym-entry-button"

export const dynamic = "force-dynamic"

export default async function GymPage() {
  const rows = await db
    .select()
    .from(gymTable)
    .orderBy(desc(gymTable.performedAt))

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Gym"
        description="What I lifted and when."
        actions={<AddGymEntryButton />}
      />
      <GymList entries={rows} />
    </div>
  )
}
