"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  type JobStatus,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

export function JobsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get("q") ?? "")

  useEffect(() => {
    setQ(params.get("q") ?? "")
  }, [params])

  const statusParam = params.get("status") ?? ""
  const selectedStatuses = new Set(
    statusParam.split(",").filter(Boolean) as JobStatus[]
  )

  const writeParams = (next: { q?: string | null; status?: string | null }) => {
    const u = new URLSearchParams(params.toString())
    if (next.q !== undefined) {
      if (next.q) u.set("q", next.q)
      else u.delete("q")
    }
    if (next.status !== undefined) {
      if (next.status) u.set("status", next.status)
      else u.delete("status")
    }
    const qs = u.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const toggleStatus = (s: JobStatus) => {
    const next = new Set(selectedStatuses)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    writeParams({ status: [...next].join(",") || null })
  }

  const hasFilters = Boolean(q || selectedStatuses.size)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => writeParams({ q: q || null })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              writeParams({ q: q || null })
            }
          }}
          placeholder="Search company or role"
          className="h-8 w-[220px] pl-8 text-xs"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {JOB_STATUSES.map((s) => {
          const active = selectedStatuses.has(s)
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleStatus(s)}
              className={cn(
                "rounded-full border border-border px-2.5 py-1 text-xs transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {JOB_STATUS_LABELS[s]}
            </button>
          )
        })}
      </div>
      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setQ("")
            writeParams({ q: null, status: null })
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      ) : null}
    </div>
  )
}
