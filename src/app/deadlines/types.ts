import { z } from "zod"
import { DEADLINE_CATEGORIES } from "@/lib/constants"

export const deadlineInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  category: z.enum(DEADLINE_CATEGORIES).default("other"),
  dueAt: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v : new Date(v)))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid date"),
  notes: z.string().max(5000).optional().or(z.literal("")),
  done: z.boolean().default(false),
})

export type DeadlineInput = z.infer<typeof deadlineInputSchema>

export type { Deadline, NewDeadline } from "@/db/schema/deadlines"
