"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JOB_SOURCES, type JobSource } from "@/lib/constants"
import type { DiscoveredJob } from "@/lib/jobs-discover"
import { JobFormDialog, type FormValues } from "./job-form-dialog"

// Keep the mapping inline so this client component doesn't pull the server-side
// fetch module (jobs-discover) into the browser bundle — the type import above
// is erased at compile time.
function publisherToSource(publisher: string | null): JobSource {
  const p = publisher?.toLowerCase() ?? ""
  if (p.includes("linkedin") && JOB_SOURCES.includes("linkedin")) {
    return "linkedin"
  }
  return "other"
}

export function SaveDiscoveredButton({ job }: { job: DiscoveredJob }) {
  const [open, setOpen] = useState(false)

  // Memoized so the dialog's reset effect doesn't fire on every render.
  const prefill = useMemo<Partial<FormValues>>(
    () => ({
      company: job.company,
      role: job.title,
      link: job.link ?? "",
      location: job.location ?? "",
      salary: job.salary ?? "",
      logoDomain: job.logoDomain ?? "",
      source: publisherToSource(job.publisher),
      appliedAt: format(new Date(), "yyyy-MM-dd"),
    }),
    [job]
  )

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 shrink-0"
        onClick={() => setOpen(true)}
      >
        <BookmarkPlus className="h-3.5 w-3.5" />
        Save
      </Button>
      <JobFormDialog open={open} onOpenChange={setOpen} prefill={prefill} />
    </>
  )
}
