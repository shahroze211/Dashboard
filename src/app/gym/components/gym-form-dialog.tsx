"use client"

import { useEffect, useState, useTransition } from "react"
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
import { WEIGHT_UNITS, type WeightUnit } from "@/lib/constants"
import { gymInputSchema, type GymEntry } from "../types"
import { createGymEntry, updateGymEntry } from "../actions"
import { ExerciseAutocomplete } from "./exercise-autocomplete"

type FormValues = {
  exercise: string
  sets: string
  reps: string
  weight: string
  unit: WeightUnit
  performedAt: string
  notes: string
}

const toFormValues = (e?: GymEntry): FormValues => ({
  exercise: e?.exercise ?? "",
  sets: String(e?.sets ?? 3),
  reps: String(e?.reps ?? 8),
  weight: e?.weight != null ? String(e.weight) : "",
  unit: (e?.unit as WeightUnit) ?? "kg",
  performedAt: e
    ? format(e.performedAt, "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  notes: e?.notes ?? "",
})

export function GymFormDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: GymEntry
}) {
  const isEdit = Boolean(entry)
  const [pending, startTransition] = useTransition()
  const [muscleHint, setMuscleHint] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(gymInputSchema) as never,
    defaultValues: toFormValues(entry),
  })

  useEffect(() => {
    form.register("exercise")
  }, [form])

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(entry))
      setMuscleHint(null)
    }
  }, [open, entry, form])

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateGymEntry(entry!.id, values)
        : await createGymEntry(values)
      if (res.ok) {
        toast.success(isEdit ? "Updated" : "Logged")
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
          <DialogTitle>{isEdit ? "Edit entry" : "Log workout"}</DialogTitle>
          <DialogDescription>
            Exercise, sets, and reps are the only required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Exercise <span className="text-foreground/80">*</span>
            </Label>
            <ExerciseAutocomplete
              value={form.watch("exercise")}
              onChange={(v) => {
                form.setValue("exercise", v, { shouldValidate: false })
                if (muscleHint) setMuscleHint(null)
              }}
              onPickCategory={setMuscleHint}
            />
            {muscleHint ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Targets: {muscleHint}
              </p>
            ) : null}
            {form.formState.errors.exercise ? (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.exercise.message}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Sets <span className="text-foreground/80">*</span>
              </Label>
              <Input type="number" min={1} {...form.register("sets")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Reps <span className="text-foreground/80">*</span>
              </Label>
              <Input type="number" min={1} {...form.register("reps")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Weight
              </Label>
              <Input
                type="number"
                min={0}
                step="0.5"
                placeholder="optional"
                {...form.register("weight")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Unit
              </Label>
              <Select
                value={form.watch("unit")}
                onValueChange={(v) => form.setValue("unit", v as WeightUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                When
              </Label>
              <Input
                type="datetime-local"
                {...form.register("performedAt")}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Notes
            </Label>
            <Textarea
              rows={2}
              placeholder="form notes, how it felt…"
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
              {pending ? "Saving…" : isEdit ? "Save" : "Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
