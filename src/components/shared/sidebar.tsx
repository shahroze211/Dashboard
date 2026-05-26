"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  CalendarClock,
  Target,
  Dumbbell,
  Apple,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/deadlines", label: "Deadlines", icon: CalendarClock },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/gym", label: "Gym", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border md:flex md:flex-col">
      <div className="px-6 py-7">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Dashboard
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {nav.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                active && "bg-accent text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-6 text-xs text-muted-foreground">
        Calm by default.
      </div>
    </aside>
  )
}
