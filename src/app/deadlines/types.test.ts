import { describe, it, expect } from "vitest"
import { deadlineInputSchema } from "./types"

describe("deadlineInputSchema", () => {
  it("requires a title", () => {
    const result = deadlineInputSchema.safeParse({ dueAt: "2026-06-01" })
    expect(result.success).toBe(false)
  })

  it("requires a dueAt", () => {
    const result = deadlineInputSchema.safeParse({ title: "Exam" })
    expect(result.success).toBe(false)
  })

  it("accepts the minimum input and defaults category to other", () => {
    const result = deadlineInputSchema.safeParse({
      title: "Exam",
      dueAt: "2026-06-01T09:00:00",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe("other")
      expect(result.data.done).toBe(false)
      expect(result.data.dueAt).toBeInstanceOf(Date)
    }
  })

  it("rejects an unknown category", () => {
    const result = deadlineInputSchema.safeParse({
      title: "Exam",
      dueAt: "2026-06-01T09:00:00",
      category: "made-up",
    })
    expect(result.success).toBe(false)
  })

  it("rejects an invalid date", () => {
    const result = deadlineInputSchema.safeParse({
      title: "Exam",
      dueAt: "not-a-date",
    })
    expect(result.success).toBe(false)
  })
})
