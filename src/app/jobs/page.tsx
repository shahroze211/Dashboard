import { and, desc, ilike, inArray, or, type SQL } from "drizzle-orm"
import { db } from "@/db"
import { jobs as jobsTable } from "@/db/schema"
import { PageHeader } from "@/components/shared/page-header"
import { JOB_STATUSES, type JobStatus } from "@/lib/constants"
import { searchJobs } from "@/lib/jobs-discover"
import { JobsList } from "./components/jobs-list"
import { JobsFilters } from "./components/jobs-filters"
import { JobsViewTabs } from "./components/jobs-view-tabs"
import { DiscoverSearch } from "./components/discover-search"
import { DiscoverList } from "./components/discover-list"
import { AddJobButton } from "./components/add-job-button"

export const dynamic = "force-dynamic"

type SearchParams = {
  q?: string
  status?: string
  view?: string
  dq?: string
  dloc?: string
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const view = searchParams.view === "discover" ? "discover" : "track"

  if (view === "discover") {
    const dq = searchParams.dq?.trim() ?? ""
    const dloc = searchParams.dloc?.trim() ?? ""
    const result = await searchJobs({ query: dq, location: dloc })
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Jobs"
          description="Live roles from LinkedIn, Indeed and other boards — save the ones worth tracking."
          actions={<JobsViewTabs active="discover" />}
        />
        <DiscoverSearch />
        <div className="mt-6">
          <DiscoverList result={result} hasQuery={Boolean(dq)} />
        </div>
      </div>
    )
  }

  const q = searchParams.q?.trim() ?? ""
  const requestedStatuses = (searchParams.status?.split(",").filter(Boolean) ??
    []) as JobStatus[]
  const validStatuses = requestedStatuses.filter((s) =>
    (JOB_STATUSES as readonly string[]).includes(s)
  )

  const conditions: SQL[] = []
  if (q) {
    const cond = or(
      ilike(jobsTable.company, `%${q}%`),
      ilike(jobsTable.role, `%${q}%`)
    )
    if (cond) conditions.push(cond)
  }
  if (validStatuses.length > 0) {
    conditions.push(inArray(jobsTable.status, validStatuses))
  }

  const rows = await db
    .select()
    .from(jobsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(jobsTable.appliedAt))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Jobs"
        description="Applications I've sent and where each one stands."
        actions={
          <div className="flex items-center gap-2">
            <JobsViewTabs active="track" />
            <AddJobButton />
          </div>
        }
      />
      <JobsFilters />
      <div className="mt-6">
        <JobsList jobs={rows} hasFilters={Boolean(q || validStatuses.length)} />
      </div>
    </div>
  )
}
