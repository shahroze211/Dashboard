import { z } from "zod"

export const nutritionInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  calories: z.coerce.number().min(0).max(20000),
  protein: z.coerce.number().min(0).max(2000).default(0),
  carbs: z.coerce.number().min(0).max(2000).default(0),
  fat: z.coerce.number().min(0).max(2000).default(0),
  servingSize: z.string().trim().max(100).optional().or(z.literal("")),
  barcode: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),
  loggedAt: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v : new Date(v)))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid date"),
})

export type NutritionInput = z.infer<typeof nutritionInputSchema>
export type { NutritionEntry, NewNutritionEntry } from "@/db/schema/nutrition"
