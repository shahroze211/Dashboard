import { describe, it, expect } from "vitest"
import { gymInputSchema } from "./types"

describe("gymInputSchema", () => {
  it("requires exercise, sets, reps", () => {
    expect(gymInputSchema.safeParse({}).success).toBe(false)
    expect(
      gymInputSchema.safeParse({ exercise: "Bench" }).success
    ).toBe(false)
    expect(
      gymInputSchema.safeParse({ exercise: "Bench", sets: "3" }).success
    ).toBe(false)
  })

  it("accepts the minimum valid input and defaults unit to kg", () => {
    const result = gymInputSchema.safeParse({
      exercise: "Bench",
      sets: 3,
      reps: 8,
      performedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.unit).toBe("kg")
      expect(result.data.weight ?? null).toBe(null)
    }
  })

  it("coerces sets/reps/weight from strings", () => {
    const result = gymInputSchema.safeParse({
      exercise: "Squat",
      sets: "5",
      reps: "5",
      weight: "80",
      performedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sets).toBe(5)
      expect(result.data.reps).toBe(5)
      expect(result.data.weight).toBe(80)
    }
  })

  it("treats empty weight as null", () => {
    const result = gymInputSchema.safeParse({
      exercise: "Pullup",
      sets: 3,
      reps: 8,
      weight: "",
      performedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.weight).toBe(null)
  })

  it("rejects negative weight", () => {
    const result = gymInputSchema.safeParse({
      exercise: "Deadlift",
      sets: 3,
      reps: 5,
      weight: "-10",
      performedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(false)
  })

  it("rejects unknown unit", () => {
    const result = gymInputSchema.safeParse({
      exercise: "Bench",
      sets: 3,
      reps: 8,
      unit: "stones",
      performedAt: "2026-05-26T10:00:00",
    })
    expect(result.success).toBe(false)
  })
})
