"use server"

import { revalidatePath } from "next/cache"
import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { goals } from "@/db/schema"
import { goalInputSchema } from "./types"

const idSchema = z.number().int().positive()

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function buildValues(data: z.infer<typeof goalInputSchema>) {
  return {
    title: data.title,
    timeframe: data.timeframe,
    periodStart: data.periodStart,
    target: data.target ?? null,
    progress: data.progress,
    unit: data.unit?.trim() || null,
    notes: data.notes?.trim() || null,
    done: data.done,
  }
}

export async function createGoal(
  raw: unknown
): Promise<ActionResult<{ id: number }>> {
  const parsed = goalInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const [row] = await db
    .insert(goals)
    .values(buildValues(parsed.data))
    .returning({ id: goals.id })
  revalidatePath("/goals")
  revalidatePath("/")
  return { ok: true, data: { id: row.id } }
}

export async function updateGoal(
  id: number,
  raw: unknown
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const parsed = goalInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  await db
    .update(goals)
    .set({ ...buildValues(parsed.data), updatedAt: new Date() })
    .where(eq(goals.id, idCheck.data))
  revalidatePath("/goals")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

const deltaSchema = z.number().int()

export async function incrementGoalProgress(
  id: number,
  delta: number
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const dCheck = deltaSchema.safeParse(delta)
  if (!dCheck.success) return { ok: false, error: "Invalid delta" }

  await db
    .update(goals)
    .set({
      progress: sql`greatest(0, ${goals.progress} + ${dCheck.data})`,
      updatedAt: new Date(),
    })
    .where(eq(goals.id, idCheck.data))
  revalidatePath("/goals")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function toggleGoalDone(
  id: number,
  done: boolean
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db
    .update(goals)
    .set({ done: Boolean(done), updatedAt: new Date() })
    .where(eq(goals.id, idCheck.data))
  revalidatePath("/goals")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function deleteGoal(id: number): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db.delete(goals).where(eq(goals.id, idCheck.data))
  revalidatePath("/goals")
  revalidatePath("/")
  return { ok: true, data: undefined }
}
