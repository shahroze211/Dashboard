import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { desc, sql } from "drizzle-orm"
import { db } from "@/db"
import { jobs } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { relativeTime } from "@/lib/utils"
import {
  JOB_STATUS_LABELS,
  type JobStatus,
} from "@/lib/constants"

async function getSummary() {
  const counts = (await db
    .select({
      status: jobs.status,
      count: sql<number>`count(*)::int`,
    })
    .from(jobs)
    .groupBy(jobs.status)) as { status: JobStatus; count: number }[]

  const [latest] = await db
    .select({ appliedAt: jobs.appliedAt })
    .from(jobs)
    .orderBy(desc(jobs.appliedAt))
    .limit(1)

  return { counts, lastApplied: latest?.appliedAt ?? null }
}

export async function JobsWidget() {
  const { counts, lastApplied } = await getSummary()
  const total = counts.reduce((sum, c) => sum + c.count, 0)
  const pipelineOrder: JobStatus[] = ["applied", "interviewing", "offer"]
  const pipeline = pipelineOrder
    .map((s) => {
      const n = counts.find((c) => c.status === s)?.count ?? 0
      return n > 0 ? `${n} ${JOB_STATUS_LABELS[s].toLowerCase()}` : null
    })
    .filter(Boolean) as string[]

  return (
    <Link href="/jobs" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Jobs</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {total === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet.
            </p>
          ) : (
            <>
              <p className="text-sm">
                {pipeline.length > 0
                  ? pipeline.join("  ·  ")
                  : `${total} tracked`}
              </p>
              {lastApplied ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Last application {relativeTime(lastApplied)}
                </p>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
