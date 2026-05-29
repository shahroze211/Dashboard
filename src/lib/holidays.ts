// Public-holiday context via the keyless Nager.Date API.
// Server-side fetch + 24h cache, mirroring the OpenFoodFacts integration pattern.

// German calendar by default — the deadlines in this dashboard are M.Sc.
// application cut-offs in Germany. Override per-call if that ever changes.
export const DEFAULT_HOLIDAY_COUNTRY = "DE"

export type PublicHoliday = {
  date: string // YYYY-MM-DD
  name: string
  localName: string
}

export type DeadlineTiming = {
  workingDays: number
  nextHoliday: { name: string; date: string } | null
}

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export async function getPublicHolidays(
  year: number,
  countryCode: string = DEFAULT_HOLIDAY_COUNTRY
): Promise<PublicHoliday[]> {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
      { next: { revalidate: 86_400 } }
    )
    if (!res.ok) return []
    const json = (await res.json()) as PublicHoliday[]
    return Array.isArray(json) ? json : []
  } catch {
    return []
  }
}

// Weekdays strictly after `from`, up to and including `to`, minus public holidays.
export function workingDaysBetween(
  from: Date,
  to: Date,
  holidayDates: Set<string>
): number {
  const cur = new Date(from)
  cur.setHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setHours(0, 0, 0, 0)
  let count = 0
  while (true) {
    cur.setDate(cur.getDate() + 1)
    if (cur > end) break
    const dow = cur.getDay()
    if (dow === 0 || dow === 6) continue
    if (holidayDates.has(toISODate(cur))) continue
    count++
  }
  return count
}

export function holidaysInRange(
  from: Date,
  to: Date,
  holidays: PublicHoliday[]
): PublicHoliday[] {
  const fromISO = toISODate(from)
  const toISO = toISODate(to)
  return holidays
    .filter((h) => h.date > fromISO && h.date <= toISO)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Annotates upcoming, not-done deadlines with working-days-left + the next
// public holiday before each one. A single cached fetch per calendar year.
export async function getDeadlineTimings(
  rows: { id: number; done: boolean; dueAt: Date }[]
): Promise<Record<number, DeadlineTiming>> {
  const now = new Date()
  const upcoming = rows.filter(
    (r) => !r.done && r.dueAt.getTime() > now.getTime()
  )
  if (upcoming.length === 0) return {}

  const years = new Set<number>([now.getFullYear()])
  for (const r of upcoming) years.add(r.dueAt.getFullYear())

  const lists = await Promise.all([...years].map((y) => getPublicHolidays(y)))
  const holidays = lists.flat()
  const holidayDates = new Set(holidays.map((h) => h.date))

  const result: Record<number, DeadlineTiming> = {}
  for (const r of upcoming) {
    const inRange = holidaysInRange(now, r.dueAt, holidays)
    result[r.id] = {
      workingDays: workingDaysBetween(now, r.dueAt, holidayDates),
      nextHoliday: inRange[0]
        ? { name: inRange[0].localName || inRange[0].name, date: inRange[0].date }
        : null,
    }
  }
  return result
}
