"use client"

import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  type JobStatus,
} from "@/lib/constants"
import { updateJobStatus } from "../actions"

export function InlineStatusSelect({
  jobId,
  status,
}: {
  jobId: number
  status: JobStatus
}) {
  const [optimistic, setOptimistic] = useState<JobStatus>(status)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setOptimistic(status)
  }, [status])

  return (
    <Select
      value={optimistic}
      onValueChange={(v) => {
        const next = v as JobStatus
        const prev = optimistic
        setOptimistic(next)
        startTransition(async () => {
          const res = await updateJobStatus(jobId, next)
          if (!res.ok) {
            setOptimistic(prev)
            toast.error("Couldn't update status")
          }
        })
      }}
    >
      <SelectTrigger className="h-7 w-[140px] border-transparent bg-transparent px-2 text-xs hover:bg-accent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {JOB_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {JOB_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
