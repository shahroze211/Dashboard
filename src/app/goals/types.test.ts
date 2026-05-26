import { describe, it, expect } from "vitest"
import { goalInputSchema } from "./types"
import { periodLabel, periodStartFor } from "./lib/period"

describe("goalInputSchema", () => {
  it("requires a title", () => {
    const result = goalInputSchema.safeParse({ periodStart: "2026-01-01" })
    expect(result.success).toBe(false)
  })

  it("accepts the minimum input and defaults timeframe to month", () => {
    const result = goalInputSchema.safeParse({
      title: "Read 24 books",
      periodStart: "2026-01-01",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.timeframe).toBe("month")
      expect(result.data.progress).toBe(0)
      expect(result.data.target ?? null).toBe(null)
    }
  })

  it("coerces target string to number", () => {
    const result = goalInputSchema.safeParse({
      title: "Read",
      periodStart: "2026-01-01",
      target: "24",
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.target).toBe(24)
  })

  it("treats empty target as null", () => {
    const result = goalInputSchema.safeParse({
      title: "Read",
      periodStart: "2026-01-01",
      target: "",
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.target).toBe(null)
  })

  it("rejects a negative target", () => {
    const result = goalInputSchema.safeParse({
      title: "Read",
      periodStart: "2026-01-01",
      target: "-5",
    })
    expect(result.success).toBe(false)
  })
})

describe("periodStartFor / periodLabel", () => {
  it("year: returns Jan 1 and labels as YYYY", () => {
    const ref = new Date(2026, 4, 26)
    const start = periodStartFor("year", ref)
    expect(start.getMonth()).toBe(0)
    expect(start.getDate()).toBe(1)
    expect(periodLabel("year", start)).toBe("2026")
  })

  it("quarter: returns start of quarter and labels Q# YYYY", () => {
    const ref = new Date(2026, 4, 26) // May → Q2
    const start = periodStartFor("quarter", ref)
    expect(start.getMonth()).toBe(3)
    expect(periodLabel("quarter", start)).toBe("Q2 2026")
  })

  it("month: returns first of month", () => {
    const ref = new Date(2026, 4, 26)
    const start = periodStartFor("month", ref)
    expect(start.getDate()).toBe(1)
    expect(start.getMonth()).toBe(4)
  })
})
