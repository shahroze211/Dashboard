"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { shiftDay, todayKey } from "../lib/date"

export function DateNavigator({ value }: { value: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const setDay = (next: string) => {
    const u = new URLSearchParams(params.toString())
    if (next === todayKey()) u.delete("date")
    else u.set("date", next)
    const qs = u.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setDay(shiftDay(value, -1))}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Input
        type="date"
        value={value}
        onChange={(e) => setDay(e.target.value)}
        className="h-8 w-[160px] text-xs"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setDay(shiftDay(value, 1))}
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs"
        onClick={() => setDay(todayKey())}
      >
        Today
      </Button>
    </div>
  )
}
