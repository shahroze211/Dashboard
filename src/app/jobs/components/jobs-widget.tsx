import Link from "next/link"
import { ArrowUpRight, Briefcase } from "lucide-react"
import { desc, gte, sql } from "drizzle-orm"
import { db } from "@/db"
import { jobs } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sparkline } from "@/components/ui/sparkline"
import { relativeTime } from "@/lib/utils"
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/constants"

const TREND_DAYS = 30

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

  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - (TREND_DAYS - 1))
  const recent = await db
    .select({ appliedAt: jobs.appliedAt })
    .from(jobs)
    .where(gte(jobs.appliedAt, cutoff))

  const buckets = new Array(TREND_DAYS).fill(0)
  for (const r of recent) {
    const diff = Math.floor(
      (r.appliedAt.getTime() - cutoff.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diff >= 0 && diff < TREND_DAYS) buckets[diff] += 1
  }

  return { counts, lastApplied: latest?.appliedAt ?? null, trend: buckets }
}

export async function JobsWidget() {
  const { counts, lastApplied, trend } = await getSummary()
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
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            Jobs
          </CardTitle>
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
              <div className="mt-3">
                <Sparkline data={trend} width={220} height={28} />
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  Last {TREND_DAYS} days
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
