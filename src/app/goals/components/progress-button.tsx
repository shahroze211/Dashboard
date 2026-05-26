"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { incrementGoalProgress } from "../actions"

export function ProgressButton({
  id,
  progress,
  target,
  unit,
}: {
  id: number
  progress: number
  target: number
  unit: string | null
}) {
  const [optimistic, setOptimistic] = useState(progress)
  const [, startTransition] = useTransition()
  const pct = target > 0 ? Math.min(100, (optimistic / target) * 100) : 0

  const adjust = (delta: number) => {
    const next = Math.max(0, optimistic + delta)
    const prev = optimistic
    setOptimistic(next)
    startTransition(async () => {
      const res = await incrementGoalProgress(id, delta)
      if (!res.ok) {
        setOptimistic(prev)
        toast.error("Couldn't update")
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Progress value={pct} className="flex-1" />
      <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
        <span>
          {optimistic} / {target}
          {unit ? ` ${unit}` : ""}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => adjust(-1)}
          disabled={optimistic <= 0}
          aria-label="Decrement"
        >
          −1
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => adjust(1)}
          aria-label="Increment"
        >
          +1
        </Button>
      </div>
    </div>
  )
}
