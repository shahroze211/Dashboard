"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { deadlines } from "@/db/schema"
import { deadlineInputSchema } from "./types"

const idSchema = z.number().int().positive()

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function buildValues(data: z.infer<typeof deadlineInputSchema>) {
  return {
    title: data.title,
    category: data.category,
    subcategory: data.subcategory?.trim() || null,
    dueAt: data.dueAt,
    notes: data.notes?.trim() || null,
    done: data.done,
  }
}

export async function createDeadline(
  raw: unknown
): Promise<ActionResult<{ id: number }>> {
  const parsed = deadlineInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const [row] = await db
    .insert(deadlines)
    .values(buildValues(parsed.data))
    .returning({ id: deadlines.id })
  revalidatePath("/deadlines")
  revalidatePath("/")
  return { ok: true, data: { id: row.id } }
}

export async function updateDeadline(
  id: number,
  raw: unknown
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const parsed = deadlineInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  await db
    .update(deadlines)
    .set({ ...buildValues(parsed.data), updatedAt: new Date() })
    .where(eq(deadlines.id, idCheck.data))
  revalidatePath("/deadlines")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function toggleDeadlineDone(
  id: number,
  done: boolean
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db
    .update(deadlines)
    .set({ done: Boolean(done), updatedAt: new Date() })
    .where(eq(deadlines.id, idCheck.data))
  revalidatePath("/deadlines")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function deleteDeadline(id: number): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db.delete(deadlines).where(eq(deadlines.id, idCheck.data))
  revalidatePath("/deadlines")
  revalidatePath("/")
  return { ok: true, data: undefined }
}
