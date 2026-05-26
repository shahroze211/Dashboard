import type { GoalTimeframe } from "@/lib/constants"

export function periodStartFor(
  timeframe: GoalTimeframe,
  ref: Date = new Date()
): Date {
  const d = new Date(ref)
  d.setHours(0, 0, 0, 0)
  if (timeframe === "year") {
    return new Date(d.getFullYear(), 0, 1)
  }
  if (timeframe === "quarter") {
    const q = Math.floor(d.getMonth() / 3)
    return new Date(d.getFullYear(), q * 3, 1)
  }
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function periodLabel(timeframe: GoalTimeframe, start: Date): string {
  const year = start.getFullYear()
  if (timeframe === "year") return `${year}`
  if (timeframe === "quarter") {
    const q = Math.floor(start.getMonth() / 3) + 1
    return `Q${q} ${year}`
  }
  return start.toLocaleString("en-US", { month: "long", year: "numeric" })
}
