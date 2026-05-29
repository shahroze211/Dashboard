"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { AnimatedCounter } from "./animated-counter"

export type HeroStat = { label: string; value: number }

function timeOfDayGreeting(hour: number): string {
  if (hour < 5) return "Up late"
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 22) return "Good evening"
  return "Up late"
}

export function Hero({
  name = "Shahroze",
  hint,
  stats,
}: {
  name?: string
  hint?: string
  stats: HeroStat[]
}) {
  const [now, setNow] = useState<Date | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setNow(new Date())
    const clock = setInterval(() => setNow(new Date()), 60_000)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearInterval(clock)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const greeting = now ? timeOfDayGreeting(now.getHours()) : "Hello"
  const dateStr = now
    ? now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card">
      {/* animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-50 blur-3xl animate-mesh-drift [background:radial-gradient(circle_at_center,hsl(245_80%_60%/0.55),transparent_70%)]"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        />
        <div
          className="absolute right-0 top-10 h-72 w-72 rounded-full opacity-40 blur-3xl animate-mesh-drift [animation-delay:-6s] [background:radial-gradient(circle_at_center,hsl(190_90%_55%/0.5),transparent_70%)]"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        />
        <div
          className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full opacity-30 blur-3xl animate-mesh-drift [animation-delay:-12s] [background:radial-gradient(circle_at_center,hsl(280_85%_60%/0.5),transparent_70%)]"
        />
      </div>

      <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* copy + stats */}
        <div className="animate-fade-in-up">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Personal dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              {name}
            </span>
            .
          </h1>
          <p className="mt-3 min-h-5 text-sm text-muted-foreground">
            {dateStr}
            {hint ? (
              <>
                <span className="mx-2 text-muted-foreground/40">·</span>
                <span>{hint}</span>
              </>
            ) : null}
          </p>

          <dl className="mt-7 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 sm:gap-x-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                  <AnimatedCounter value={s.value} />
                </dd>
                <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* floating image */}
        <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-xs lg:block">
          <div
            className="absolute inset-0 -z-10 rounded-[2rem] opacity-70 blur-2xl [background:radial-gradient(circle_at_50%_40%,hsl(245_80%_60%/0.6),transparent_70%)]"
            style={{ transform: `translateY(${scrollY * -0.08}px)` }}
          />
          <div
            className="h-full w-full animate-float"
            style={{ transform: `translateY(${scrollY * -0.12}px)` }}
          >
            <Image
              src="/hero.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 0px, 320px"
              className="rounded-[2rem] object-cover shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
