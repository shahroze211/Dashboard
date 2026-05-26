"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { gymEntries } from "@/db/schema"
import { gymInputSchema } from "./types"

const idSchema = z.number().int().positive()

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function buildValues(data: z.infer<typeof gymInputSchema>) {
  return {
    exercise: data.exercise,
    sets: data.sets,
    reps: data.reps,
    weight: data.weight != null ? String(data.weight) : null,
    unit: data.unit,
    performedAt: data.performedAt,
    notes: data.notes?.trim() || null,
  }
}

export async function createGymEntry(
  raw: unknown
): Promise<ActionResult<{ id: number }>> {
  const parsed = gymInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const [row] = await db
    .insert(gymEntries)
    .values(buildValues(parsed.data))
    .returning({ id: gymEntries.id })
  revalidatePath("/gym")
  revalidatePath("/")
  return { ok: true, data: { id: row.id } }
}

export async function updateGymEntry(
  id: number,
  raw: unknown
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const parsed = gymInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  await db
    .update(gymEntries)
    .set({ ...buildValues(parsed.data), updatedAt: new Date() })
    .where(eq(gymEntries.id, idCheck.data))
  revalidatePath("/gym")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function deleteGymEntry(id: number): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db.delete(gymEntries).where(eq(gymEntries.id, idCheck.data))
  revalidatePath("/gym")
  revalidatePath("/")
  return { ok: true, data: undefined }
}
