"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Scan, Search } from "lucide-react"
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
import {
  nutritionInputSchema,
  type NutritionEntry,
  type FoodSearchItem,
} from "../types"
import {
  createNutritionEntry,
  lookupFood,
  searchFoods,
  updateNutritionEntry,
} from "../actions"

type FormValues = {
  name: string
  calories: string
  protein: string
  carbs: string
  fat: string
  servingSize: string
  barcode: string
  loggedAt: string
}

const toFormValues = (e?: NutritionEntry, isoLoggedAt?: string): FormValues => ({
  name: e?.name ?? "",
  calories: e?.calories != null ? String(e.calories) : "",
  protein: e?.protein != null ? String(e.protein) : "",
  carbs: e?.carbs != null ? String(e.carbs) : "",
  fat: e?.fat != null ? String(e.fat) : "",
  servingSize: e?.servingSize ?? "",
  barcode: e?.barcode ?? "",
  loggedAt: e
    ? format(e.loggedAt, "yyyy-MM-dd'T'HH:mm")
    : isoLoggedAt ?? format(new Date(), "yyyy-MM-dd'T'HH:mm"),
})

export function NutritionFormDialog({
  open,
  onOpenChange,
  entry,
  defaultLoggedAt,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: NutritionEntry
  defaultLoggedAt?: string
}) {
  const isEdit = Boolean(entry)
  const [pending, startTransition] = useTransition()
  const [looking, setLooking] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<FoodSearchItem[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(nutritionInputSchema) as never,
    defaultValues: toFormValues(entry, defaultLoggedAt),
  })

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(entry, defaultLoggedAt))
      setSearchTerm("")
      setResults([])
    }
  }, [open, entry, defaultLoggedAt, form])

  const handleSearch = async () => {
    const q = searchTerm.trim()
    if (q.length < 2) {
      toast.error("Type at least 2 characters")
      return
    }
    setSearching(true)
    const res = await searchFoods(q)
    setSearching(false)
    setResults(res)
    if (res.length === 0) toast.error("No matches found")
  }

  const fillFromItem = (item: FoodSearchItem) => {
    form.setValue("name", item.brand ? `${item.name} (${item.brand})` : item.name)
    form.setValue("calories", String(item.calories))
    form.setValue("protein", String(item.protein))
    form.setValue("carbs", String(item.carbs))
    form.setValue("fat", String(item.fat))
    form.setValue("servingSize", "100g")
    if (item.barcode) form.setValue("barcode", item.barcode)
    setResults([])
    setSearchTerm("")
    toast.success("Filled from OpenFoodFacts")
  }

  const handleLookup = async () => {
    const barcode = form.getValues("barcode")
    if (!barcode) {
      toast.error("Enter a barcode first")
      return
    }
    setLooking(true)
    const res = await lookupFood(barcode)
    setLooking(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    form.setValue("name", res.data.name)
    form.setValue("calories", String(res.data.calories))
    form.setValue("protein", String(res.data.protein))
    form.setValue("carbs", String(res.data.carbs))
    form.setValue("fat", String(res.data.fat))
    form.setValue("servingSize", res.data.servingSize)
    toast.success("Filled from OpenFoodFacts")
  }

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateNutritionEntry(entry!.id, values)
        : await createNutritionEntry(values)
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit food" : "Log food"}</DialogTitle>
          <DialogDescription>
            Search by name, paste a barcode, or enter macros manually.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Search by name
            </Label>
            <div className="grid grid-cols-[1fr_auto] items-end gap-2">
              <Input
                placeholder="e.g. greek yogurt"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearch}
                disabled={searching}
              >
                <Search className="h-4 w-4" />
                {searching ? "Searching…" : "Search"}
              </Button>
            </div>
            {results.length > 0 ? (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-border animate-fade-in">
                {results.map((item, i) => (
                  <li
                    key={`${item.barcode ?? item.name}-${i}`}
                    className="border-b border-border last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => fillFromItem(item)}
                      className="block w-full px-3 py-2 text-left hover:bg-accent"
                    >
                      <span className="block truncate text-sm">
                        {item.name}
                        {item.brand ? (
                          <span className="text-muted-foreground">
                            {" "}
                            · {item.brand}
                          </span>
                        ) : null}
                      </span>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {item.calories} kcal · P{item.protein} C{item.carbs} F
                        {item.fat} / 100g
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Barcode (optional)
              </Label>
              <Input
                inputMode="numeric"
                placeholder="e.g. 5449000000996"
                {...form.register("barcode")}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleLookup}
              disabled={looking}
            >
              <Scan className="h-4 w-4" />
              {looking ? "Looking…" : "Lookup"}
            </Button>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Name <span className="text-foreground/80">*</span>
            </Label>
            <Input
              placeholder="Banana"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                kcal <span className="text-foreground/80">*</span>
              </Label>
              <Input type="number" min={0} step="0.1" {...form.register("calories")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Protein (g)
              </Label>
              <Input type="number" min={0} step="0.1" {...form.register("protein")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Carbs (g)
              </Label>
              <Input type="number" min={0} step="0.1" {...form.register("carbs")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Fat (g)
              </Label>
              <Input type="number" min={0} step="0.1" {...form.register("fat")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Serving
              </Label>
              <Input placeholder="1 cup, 100g…" {...form.register("servingSize")} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                When
              </Label>
              <Input type="datetime-local" {...form.register("loggedAt")} />
            </div>
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
