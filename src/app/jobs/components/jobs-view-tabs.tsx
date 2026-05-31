"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Briefcase, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { value: "track", label: "Tracked", icon: Briefcase },
  { value: "discover", label: "Discover", icon: Compass },
] as const

export function JobsViewTabs({ active }: { active: "track" | "discover" }) {
  const pathname = usePathname()
  const params = useSearchParams()

  const hrefFor = (value: string) => {
    const u = new URLSearchParams(params.toString())
    if (value === "track") u.delete("view")
    else u.set("view", value)
    const qs = u.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div className="inline-flex rounded-lg border border-border p-0.5">
      {TABS.map((tab) => {
        const isActive = tab.value === active
        const Icon = tab.icon
        return (
          <Link
            key={tab.value}
            href={hrefFor(tab.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
