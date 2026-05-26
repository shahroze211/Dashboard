import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { db } from "@/db"
import { goals } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function getSummary() {
  const all = await db.select().from(goals)
  const active = all.filter((g) => !g.done)
  const withTargets = active.filter((g) => g.target && g.target > 0)
  let closest: { title: string; pct: number } | null = null
  for (const g of withTargets) {
    const pct = Math.min(100, (g.progress / (g.target as number)) * 100)
    if (!closest || pct > closest.pct) {
      closest = { title: g.title, pct }
    }
  }
  return {
    activeCount: active.length,
    doneCount: all.length - active.length,
    closest,
  }
}

export async function GoalsWidget() {
  const { activeCount, doneCount, closest } = await getSummary()

  return (
    <Link href="/goals" className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Goals</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          {activeCount === 0 && doneCount === 0 ? (
            <p className="text-sm text-muted-foreground">No goals yet.</p>
          ) : (
            <>
              <p className="text-sm">
                {activeCount} active
                {doneCount > 0 ? `  ·  ${doneCount} done` : ""}
              </p>
              {closest ? (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Closest: {closest.title} — {Math.round(closest.pct)}%
                </p>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
