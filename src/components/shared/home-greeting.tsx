"use client"

import { useEffect, useState } from "react"

function timeOfDayGreeting(hour: number): string {
  if (hour < 5) return "Up late"
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 22) return "Good evening"
  return "Up late"
}

export function HomeGreeting({
  name = "Shahroze",
  hint,
}: {
  name?: string
  hint?: string
}) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Render a stable skeleton during SSR / first paint to avoid hydration warnings.
  if (!now) {
    return (
      <header className="mb-10">
        <div className="h-8 w-72 rounded-md bg-muted/60" />
        <div className="mt-2 h-4 w-40 rounded-md bg-muted/40" />
      </header>
    )
  }

  const greeting = timeOfDayGreeting(now.getHours())
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {greeting}, {name}.
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {dateStr}
        {hint ? (
          <>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span>{hint}</span>
          </>
        ) : null}
      </p>
    </header>
  )
}
