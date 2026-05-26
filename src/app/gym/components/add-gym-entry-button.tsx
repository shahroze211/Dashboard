"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAutoOpenFromQuery } from "@/lib/use-auto-open"
import { GymFormDialog } from "./gym-form-dialog"

export function AddGymEntryButton() {
  const [open, setOpen] = useState(false)
  useAutoOpenFromQuery("add", setOpen)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Log workout
      </Button>
      <GymFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
