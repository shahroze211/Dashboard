"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { toggleDeadlineDone } from "../actions"

export function DeadlineCheckbox({
  id,
  done,
}: {
  id: number
  done: boolean
}) {
  const [optimistic, setOptimistic] = useState(done)
  const [, startTransition] = useTransition()

  return (
    <button
      type="button"
      onClick={() => {
        const next = !optimistic
        setOptimistic(next)
        startTransition(async () => {
          const res = await toggleDeadlineDone(id, next)
          if (!res.ok) {
            setOptimistic(!next)
            toast.error("Couldn't update")
          }
        })
      }}
      aria-label={optimistic ? "Mark as not done" : "Mark as done"}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        optimistic
          ? "border-foreground bg-foreground text-background"
          : "border-input hover:border-foreground/50"
      )}
    >
      {optimistic ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
    </button>
  )
}
