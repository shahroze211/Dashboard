"use client"

import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GOAL_TIMEFRAMES,
  GOAL_TIMEFRAME_LABELS,
  type GoalTimeframe,
} from "@/lib/constants"
import { goalInputSchema, type Goal } from "../types"
import { createGoal, updateGoal } from "../actions"
import { periodStartFor } from "../lib/period"

type FormValues = {
  title: string
  timeframe: GoalTimeframe
  periodStart: string
  target: string
  progress: string
  unit: string
  notes: string
  done: boolean
}

const toFormValues = (g?: Goal): FormValues => ({
  title: g?.title ?? "",
  timeframe: g?.timeframe ?? "month",
  periodStart: g
    ? format(g.periodStart, "yyyy-MM-dd")
    : format(periodStartFor("month"), "yyyy-MM-dd"),
  target: g?.target != null ? String(g.target) : "",
  progress: String(g?.progress ?? 0),
  unit: g?.unit ?? "",
  notes: g?.notes ?? "",
  done: g?.done ?? false,
})

export function GoalFormDialog({
  open,
  onOpenChange,
  goal,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal
}) {
  const isEdit = Boolean(goal)
  const [pending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(goalInputSchema) as never,
    defaultValues: toFormValues(goal),
  })

  useEffect(() => {
    if (open) form.reset(toFormValues(goal))
  }, [open, goal, form])

  const timeframe = form.watch("timeframe")
  useEffect(() => {
    if (!goal && open) {
      form.setValue(
        "periodStart",
        format(periodStartFor(timeframe), "yyyy-MM-dd")
      )
    }
  }, [timeframe, goal, open, form])

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateGoal(goal!.id, values)
        : await createGoal(values)
      if (res.ok) {
        toast.success(isEdit ? "Updated" : "Goal added")
        onOpenChange(false)
      } else {
        if (res.fieldErrors) {
          for (const [field, errors] of Object.entries(res.fieldErrors)) {
            if (errors?.[0]) {
              form.setError(field as keyof FormValues, { message: errors[0] })
            }
          }
        }
        toast.error(res.error || "Couldn't save")
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit goal" : "Add goal"}</DialogTitle>
          <DialogDescription>
            Title + timeframe is enough. Target and unit are optional.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Title <span className="text-foreground/80">*</span>
            </Label>
            <Input
              autoFocus
              placeholder="Read 24 books"
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Timeframe
              </Label>
              <Select
                value={form.watch("timeframe")}
                onValueChange={(v) =>
                  form.setValue("timeframe", v as GoalTimeframe)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TIMEFRAMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {GOAL_TIMEFRAME_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Period start
              </Label>
              <Input type="date" {...form.register("periodStart")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Target
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="optional"
                {...form.register("target")}
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Unit
              </Label>
              <Input placeholder="books, miles…" {...form.register("unit")} />
            </div>
          </div>
          {isEdit ? (
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Progress
              </Label>
              <Input
                type="number"
                min={0}
                {...form.register("progress")}
              />
            </div>
          ) : null}
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Notes
            </Label>
            <Textarea
              rows={2}
              placeholder="optional"
              {...form.register("notes")}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
