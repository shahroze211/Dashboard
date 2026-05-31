import { z } from "zod"
import { JOB_STATUSES, JOB_SOURCES, JOB_CATEGORIES } from "@/lib/constants"

export const jobInputSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(200, "Company is too long"),
  role: z
    .string()
    .trim()
    .min(1, "Role is required")
    .max(200, "Role is too long"),
  category: z
    .enum([...JOB_CATEGORIES, ""] as [string, ...string[]])
    .optional(),
  status: z.enum(JOB_STATUSES).default("applied"),
  appliedAt: z
    .union([z.string(), z.date(), z.undefined(), z.null()])
    .transform((v) => {
      if (!v) return undefined
      if (v instanceof Date) return v
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? undefined : d
    })
    .optional(),
  link: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (v) => !v || /^https?:\/\//i.test(v),
      "Must start with http:// or https://"
    )
    .optional()
    .or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  salary: z.string().trim().max(200).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  logoDomain: z.string().trim().max(255).optional().or(z.literal("")),
  source: z
    .enum([...JOB_SOURCES, ""] as [string, ...string[]])
    .optional(),
})

export type JobInput = z.infer<typeof jobInputSchema>

export type { Job, NewJob } from "@/db/schema/jobs"
