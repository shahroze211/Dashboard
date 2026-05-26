import { describe, it, expect } from "vitest"
import { nutritionInputSchema } from "./types"
import { dayRangeUTC, shiftDay, todayKey } from "./lib/date"

describe("nutritionInputSchema", () => {
  it("requires name and calories", () => {
    expect(nutritionInputSchema.safeParse({}).success).toBe(false)
    expect(
      nutritionInputSchema.safeParse({ name: "Apple" }).success
    ).toBe(false)
  })

  it("accepts the minimum valid input", () => {
    const result = nutritionInputSchema.safeParse({
      name: "Apple",
      calories: 95,
      loggedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.protein).toBe(0)
      expect(result.data.carbs).toBe(0)
      expect(result.data.fat).toBe(0)
    }
  })

  it("coerces numeric strings", () => {
    const result = nutritionInputSchema.safeParse({
      name: "Yogurt",
      calories: "150",
      protein: "12.5",
      carbs: "10",
      fat: "8.2",
      loggedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.calories).toBe(150)
      expect(result.data.protein).toBe(12.5)
    }
  })

  it("rejects negative calories", () => {
    const result = nutritionInputSchema.safeParse({
      name: "X",
      calories: -100,
      loggedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(false)
  })
})

describe("date helpers", () => {
  it("todayKey returns YYYY-MM-DD shape", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("shiftDay shifts +1 and -1 correctly", () => {
    expect(shiftDay("2026-05-26", 1)).toBe("2026-05-27")
    expect(shiftDay("2026-05-26", -1)).toBe("2026-05-25")
    expect(shiftDay("2026-12-31", 1)).toBe("2027-01-01")
  })

  it("dayRangeUTC produces a 24h window", () => {
    const { start, end } = dayRangeUTC("2026-05-26")
    expect(end.getTime() - start.getTime()).toBeGreaterThan(86_399_000)
    expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(86_399_999)
  })
})
