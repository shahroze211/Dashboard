export function dayRangeUTC(dayKey: string): { start: Date; end: Date } {
  // dayKey is YYYY-MM-DD (local). Build a range covering that local day,
  // converted to UTC-equivalent timestamps the DB compares against.
  const [y, m, d] = dayKey.split("-").map(Number)
  const start = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0)
  const end = new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999)
  return { start, end }
}

export function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function shiftDay(dayKey: string, deltaDays: number): string {
  const [y, m, d] = dayKey.split("-").map(Number)
  const date = new Date(y, (m ?? 1) - 1, d ?? 1)
  date.setDate(date.getDate() + deltaDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
