import { z } from "zod"
import { GOAL_TIMEFRAMES } from "@/lib/constants"

export const goalInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  timeframe: z.enum(GOAL_TIMEFRAMES).default("month"),
  periodStart: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v : new Date(v)))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid date"),
  target: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .nullable()
    .optional(),
  progress: z.coerce.number().int().min(0).default(0),
  unit: z.string().trim().max(50).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  done: z.boolean().default(false),
})

export type GoalInput = z.infer<typeof goalInputSchema>
export type { Goal, NewGoal } from "@/db/schema/goals"
