import { describe, it, expect } from "vitest"
import { jobInputSchema } from "./types"

describe("jobInputSchema", () => {
  it("requires company", () => {
    const result = jobInputSchema.safeParse({ role: "Engineer" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.company?.length).toBeGreaterThan(0)
    }
  })

  it("requires role", () => {
    const result = jobInputSchema.safeParse({ company: "Acme" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.role?.length).toBeGreaterThan(0)
    }
  })

  it("accepts the minimum valid input and defaults status to applied", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      role: "Engineer",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe("applied")
    }
  })

  it("trims whitespace from company and role", () => {
    const result = jobInputSchema.safeParse({
      company: "  Acme  ",
      role: "  Engineer  ",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.company).toBe("Acme")
      expect(result.data.role).toBe("Engineer")
    }
  })

  it("coerces an appliedAt string to a Date", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      role: "Engineer",
      appliedAt: "2026-05-26",
    })
    expect(result.success).toBe(true)
    if (result.success && result.data.appliedAt) {
      expect(result.data.appliedAt).toBeInstanceOf(Date)
      expect(result.data.appliedAt.getUTCFullYear()).toBe(2026)
    }
  })

  it("rejects a link that isn't http(s)", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      role: "Engineer",
      link: "not-a-url",
    })
    expect(result.success).toBe(false)
  })

  it("accepts an empty link as no value", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      role: "Engineer",
      link: "",
    })
    expect(result.success).toBe(true)
  })

  it("rejects an unknown status", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      role: "Engineer",
      status: "pending",
    })
    expect(result.success).toBe(false)
  })

  it("accepts all valid statuses", () => {
    const statuses = [
      "applied",
      "interviewing",
      "offer",
      "rejected",
      "ghosted",
      "withdrawn",
    ] as const
    for (const status of statuses) {
      const result = jobInputSchema.safeParse({
        company: "Acme",
        role: "Engineer",
        status,
      })
      expect(result.success, `status ${status} should be valid`).toBe(true)
    }
  })
})
