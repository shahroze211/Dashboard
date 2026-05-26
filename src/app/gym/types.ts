import { z } from "zod"
import { WEIGHT_UNITS } from "@/lib/constants"

export const gymInputSchema = z.object({
  exercise: z
    .string()
    .trim()
    .min(1, "Exercise is required")
    .max(120, "Exercise name is too long"),
  sets: z.coerce.number().int().min(1, "At least 1 set").max(50),
  reps: z.coerce.number().int().min(1, "At least 1 rep").max(500),
  weight: z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : v),
      z.coerce.number().nonnegative().nullable()
    )
    .optional(),
  unit: z.enum(WEIGHT_UNITS).default("kg"),
  performedAt: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v : new Date(v)))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid date"),
  notes: z.string().max(2000).optional().or(z.literal("")),
})

export type GymInput = z.infer<typeof gymInputSchema>
export type { GymEntry, NewGymEntry } from "@/db/schema/gym"
