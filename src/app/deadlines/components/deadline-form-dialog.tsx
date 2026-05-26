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
  DEADLINE_CATEGORIES,
  DEADLINE_CATEGORY_LABELS,
} from "@/lib/constants"
import { deadlineInputSchema, type Deadline } from "../types"
import { createDeadline, updateDeadline } from "../actions"

type FormValues = {
  title: string
  category: (typeof DEADLINE_CATEGORIES)[number]
  dueAt: string
  notes: string
  done: boolean
}

const toFormValues = (d?: Deadline): FormValues => ({
  title: d?.title ?? "",
  category: d?.category ?? "other",
  dueAt: d
    ? format(d.dueAt, "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  notes: d?.notes ?? "",
  done: d?.done ?? false,
})

export function DeadlineFormDialog({
  open,
  onOpenChange,
  deadline,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  deadline?: Deadline
}) {
  const isEdit = Boolean(deadline)
  const [pending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(deadlineInputSchema) as never,
    defaultValues: toFormValues(deadline),
  })

  useEffect(() => {
    if (open) form.reset(toFormValues(deadline))
  }, [open, deadline, form])

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateDeadline(deadline!.id, values)
        : await createDeadline(values)
      if (res.ok) {
        toast.success(isEdit ? "Updated" : "Deadline added")
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
          <DialogTitle>{isEdit ? "Edit deadline" : "Add deadline"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details." : "Title and due date are required."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Title <span className="text-foreground/80">*</span>
            </Label>
            <Input
              autoFocus
              placeholder="Spanish midterm"
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
                Due <span className="text-foreground/80">*</span>
              </Label>
              <Input type="datetime-local" {...form.register("dueAt")} />
              {form.formState.errors.dueAt ? (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.dueAt.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Category
              </Label>
              <Select
                value={form.watch("category")}
                onValueChange={(v) =>
                  form.setValue("category", v as FormValues["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEADLINE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {DEADLINE_CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Notes
            </Label>
            <Textarea
              rows={3}
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
