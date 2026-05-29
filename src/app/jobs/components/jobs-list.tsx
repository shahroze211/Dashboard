import { Fragment } from "react"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import {
  JOB_CATEGORIES,
  JOB_CATEGORY_LABELS,
  JOB_SOURCE_LABELS,
  type JobCategory,
  type JobSource,
} from "@/lib/constants"
import type { Job } from "../types"
import { CompanyLogo } from "./company-logo"
import { InlineStatusSelect } from "./inline-status-select"
import { JobsRowActions } from "./jobs-row-actions"

export function JobsList({
  jobs,
  hasFilters,
}: {
  jobs: Job[]
  hasFilters: boolean
}) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "No matches" : "No applications yet"}
        description={
          hasFilters
            ? "Try clearing your filters."
            : "Add your first application with the button above."
        }
      />
    )
  }

  const order: (JobCategory | "other")[] = [...JOB_CATEGORIES, "other"]
  const groups = order
    .map((cat) => ({
      cat,
      label: cat === "other" ? "Other" : JOB_CATEGORY_LABELS[cat as JobCategory],
      items: jobs.filter((j) => (j.category ?? "other") === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[160px]">Status</TableHead>
            <TableHead className="w-[120px]">Applied</TableHead>
            <TableHead className="w-[120px]">Source</TableHead>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((g) => (
            <Fragment key={g.cat}>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="bg-muted/40 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {g.label}
                  <span className="ml-2 text-muted-foreground/60">
                    {g.items.length}
                  </span>
                </TableCell>
              </TableRow>
              {g.items.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo
                        company={job.company}
                        link={job.link}
                        domain={job.logoDomain}
                      />
                      <span>{job.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.role}
                  </TableCell>
                  <TableCell>
                    <InlineStatusSelect jobId={job.id} status={job.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(job.appliedAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {job.source
                      ? JOB_SOURCE_LABELS[job.source as JobSource] ?? job.source
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {job.link ? (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Open posting"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <JobsRowActions job={job} />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
