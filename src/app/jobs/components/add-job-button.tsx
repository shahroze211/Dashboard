"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobFormDialog } from "./job-form-dialog"

export function AddJobButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add job
      </Button>
      <JobFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
