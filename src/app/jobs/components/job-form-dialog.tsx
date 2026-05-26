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
  JOB_SOURCES,
  JOB_SOURCE_LABELS,
  JOB_STATUSES,
  JOB_STATUS_LABELS,
} from "@/lib/constants"
import { jobInputSchema, type Job } from "../types"
import { createJob, updateJob } from "../actions"

type FormValues = {
  company: string
  role: string
  status: (typeof JOB_STATUSES)[number]
  appliedAt: string
  link: string
  notes: string
  salary: string
  location: string
  source: string
}

const toFormValues = (job?: Job): FormValues => ({
  company: job?.company ?? "",
  role: job?.role ?? "",
  status: job?.status ?? "applied",
  appliedAt: job
    ? format(job.appliedAt, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd"),
  link: job?.link ?? "",
  notes: job?.notes ?? "",
  salary: job?.salary ?? "",
  location: job?.location ?? "",
  source: job?.source ?? "",
})

export function JobFormDialog({
  open,
  onOpenChange,
  job,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job
}) {
  const isEdit = Boolean(job)
  const [pending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(jobInputSchema) as never,
    defaultValues: toFormValues(job),
  })

  useEffect(() => {
    if (open) form.reset(toFormValues(job))
  }, [open, job, form])

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const payload = {
        ...values,
        appliedAt: values.appliedAt || undefined,
      }
      const res = isEdit
        ? await updateJob(job!.id, payload)
        : await createJob(payload)
      if (res.ok) {
        toast.success(isEdit ? "Updated" : "Application added")
        onOpenChange(false)
      } else {
        if (res.fieldErrors) {
          for (const [field, errors] of Object.entries(res.fieldErrors)) {
            if (errors?.[0]) {
              form.setError(field as keyof FormValues, {
                message: errors[0],
              })
            }
          }
        }
        toast.error(res.error || "Couldn't save")
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update what you know about this one."
              : "Company and role are the only required fields."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" required error={form.formState.errors.company?.message}>
              <Input
                autoFocus
                placeholder="Acme Inc."
                {...form.register("company")}
              />
            </Field>
            <Field label="Role" required error={form.formState.errors.role?.message}>
              <Input
                placeholder="Software Engineer"
                {...form.register("role")}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.watch("status")}
                onValueChange={(v) => form.setValue("status", v as FormValues["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {JOB_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Applied">
              <Input type="date" {...form.register("appliedAt")} />
            </Field>
            <Field label="Source">
              <Select
                value={form.watch("source") || "_none"}
                onValueChange={(v) =>
                  form.setValue("source", v === "_none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">—</SelectItem>
                  {JOB_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {JOB_SOURCE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Salary">
              <Input placeholder="optional" {...form.register("salary")} />
            </Field>
            <Field label="Location" className="sm:col-span-2">
              <Input placeholder="optional" {...form.register("location")} />
            </Field>
          </div>
          <Field label="Link" error={form.formState.errors.link?.message}>
            <Input
              type="url"
              placeholder="https://…"
              {...form.register("link")}
            />
          </Field>
          <Field label="Notes">
            <Textarea
              rows={3}
              placeholder="Anything to remember"
              {...form.register("notes")}
            />
          </Field>
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

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs text-muted-foreground">
        {label}
        {required ? <span className="ml-0.5 text-foreground/80">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
