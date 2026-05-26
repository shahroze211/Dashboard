import { cn } from "@/lib/utils"
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/constants"

const toneByStatus: Record<JobStatus, string> = {
  applied:
    "bg-secondary text-secondary-foreground",
  interviewing:
    "bg-foreground/15 text-foreground",
  offer:
    "bg-foreground text-background",
  rejected:
    "bg-muted text-muted-foreground line-through decoration-muted-foreground/40",
  ghosted:
    "bg-muted text-muted-foreground italic",
  withdrawn:
    "bg-muted text-muted-foreground",
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        toneByStatus[status]
      )}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  )
}
