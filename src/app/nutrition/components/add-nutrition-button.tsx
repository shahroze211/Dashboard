"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAutoOpenFromQuery } from "@/lib/use-auto-open"
import { NutritionFormDialog } from "./nutrition-form-dialog"

export function AddNutritionButton({
  defaultLoggedAt,
}: {
  defaultLoggedAt?: string
}) {
  const [open, setOpen] = useState(false)
  useAutoOpenFromQuery("add", setOpen)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Log food
      </Button>
      <NutritionFormDialog
        open={open}
        onOpenChange={setOpen}
        defaultLoggedAt={defaultLoggedAt}
      />
    </>
  )
}
