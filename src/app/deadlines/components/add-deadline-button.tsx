"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAutoOpenFromQuery } from "@/lib/use-auto-open"
import { DeadlineFormDialog } from "./deadline-form-dialog"

export function AddDeadlineButton() {
  const [open, setOpen] = useState(false)
  useAutoOpenFromQuery("add", setOpen)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add deadline
      </Button>
      <DeadlineFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
