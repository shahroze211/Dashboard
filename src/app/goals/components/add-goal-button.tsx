"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoalFormDialog } from "./goal-form-dialog"

export function AddGoalButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add goal
      </Button>
      <GoalFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
