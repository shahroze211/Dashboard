"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { jobs } from "@/db/schema"
import { jobInputSchema } from "./types"
import { JOB_STATUSES, type JobStatus, type JobCategory } from "@/lib/constants"

const idSchema = z.number().int().positive()

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function buildJobValues(data: z.infer<typeof jobInputSchema>) {
  return {
    company: data.company,
    role: data.role,
    category:
      data.category && data.category !== ""
        ? (data.category as JobCategory)
        : null,
    status: data.status,
    appliedAt: data.appliedAt,
    link: data.link?.trim() || null,
    notes: data.notes?.trim() || null,
    salary: data.salary?.trim() || null,
    location: data.location?.trim() || null,
    logoDomain: data.logoDomain?.trim() || null,
    source: data.source && data.source !== "" ? data.source : null,
  }
}

export async function createJob(raw: unknown): Promise<ActionResult<{ id: number }>> {
  const parsed = jobInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const values = buildJobValues(parsed.data)
  const [created] = await db
    .insert(jobs)
    .values({
      ...values,
      appliedAt: values.appliedAt ?? new Date(),
    })
    .returning({ id: jobs.id })
  revalidatePath("/jobs")
  revalidatePath("/")
  return { ok: true, data: { id: created.id } }
}

export async function updateJob(
  id: number,
  raw: unknown
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }

  const parsed = jobInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const values = buildJobValues(parsed.data)
  await db
    .update(jobs)
    .set({
      company: values.company,
      role: values.role,
      category: values.category,
      status: values.status,
      ...(values.appliedAt ? { appliedAt: values.appliedAt } : {}),
      link: values.link,
      notes: values.notes,
      salary: values.salary,
      location: values.location,
      logoDomain: values.logoDomain,
      source: values.source,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, idCheck.data))
  revalidatePath("/jobs")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

const statusSchema = z.enum(JOB_STATUSES)

export async function updateJobStatus(
  id: number,
  status: JobStatus
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const sCheck = statusSchema.safeParse(status)
  if (!sCheck.success) return { ok: false, error: "Invalid status" }

  await db
    .update(jobs)
    .set({ status: sCheck.data, updatedAt: new Date() })
    .where(eq(jobs.id, idCheck.data))
  revalidatePath("/jobs")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function deleteJob(id: number): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }

  await db.delete(jobs).where(eq(jobs.id, idCheck.data))
  revalidatePath("/jobs")
  revalidatePath("/")
  return { ok: true, data: undefined }
}
