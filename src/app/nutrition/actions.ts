"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { nutritionEntries } from "@/db/schema"
import { nutritionInputSchema, type FoodSearchItem } from "./types"

const idSchema = z.number().int().positive()

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function buildValues(data: z.infer<typeof nutritionInputSchema>) {
  return {
    name: data.name,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    servingSize: data.servingSize?.trim() || null,
    barcode: data.barcode?.trim() || null,
    loggedAt: data.loggedAt,
  }
}

export async function createNutritionEntry(
  raw: unknown
): Promise<ActionResult<{ id: number }>> {
  const parsed = nutritionInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  const [row] = await db
    .insert(nutritionEntries)
    .values(buildValues(parsed.data))
    .returning({ id: nutritionEntries.id })
  revalidatePath("/nutrition")
  revalidatePath("/")
  return { ok: true, data: { id: row.id } }
}

export async function updateNutritionEntry(
  id: number,
  raw: unknown
): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  const parsed = nutritionInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  await db
    .update(nutritionEntries)
    .set({ ...buildValues(parsed.data), updatedAt: new Date() })
    .where(eq(nutritionEntries.id, idCheck.data))
  revalidatePath("/nutrition")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

export async function deleteNutritionEntry(id: number): Promise<ActionResult> {
  const idCheck = idSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: "Invalid id" }
  await db.delete(nutritionEntries).where(eq(nutritionEntries.id, idCheck.data))
  revalidatePath("/nutrition")
  revalidatePath("/")
  return { ok: true, data: undefined }
}

// ---------- OpenFoodFacts lookup ----------

type LookupResult =
  | {
      ok: true
      data: {
        name: string
        calories: number
        protein: number
        carbs: number
        fat: number
        servingSize: string
      }
    }
  | { ok: false; error: string }

type OFFProduct = {
  product_name?: string
  product_name_en?: string
  generic_name?: string
  nutriments?: {
    "energy-kcal_100g"?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
  }
}

export async function lookupFood(barcode: string): Promise<LookupResult> {
  const cleaned = barcode.trim().replace(/\s+/g, "")
  if (!/^\d{8,14}$/.test(cleaned)) {
    return { ok: false, error: "Enter a numeric barcode (8–14 digits)" }
  }
  try {
    const res = await fetch(
      `https://world.openfoodfacts.net/api/v2/product/${cleaned}.json`,
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "DashboardApp/0.1 (personal)" },
      }
    )
    if (!res.ok) return { ok: false, error: "Lookup failed" }
    const json = (await res.json()) as { status?: number; product?: OFFProduct }
    if (json.status === 0 || !json.product) {
      return { ok: false, error: "Product not found" }
    }
    const p = json.product
    const n = p.nutriments ?? {}
    return {
      ok: true,
      data: {
        name:
          p.product_name?.trim() ||
          p.product_name_en?.trim() ||
          p.generic_name?.trim() ||
          "Unknown product",
        calories: Number(n["energy-kcal_100g"] ?? 0),
        protein: Number(n.proteins_100g ?? 0),
        carbs: Number(n.carbohydrates_100g ?? 0),
        fat: Number(n.fat_100g ?? 0),
        servingSize: "100g",
      },
    }
  } catch {
    return { ok: false, error: "Lookup failed" }
  }
}

// ---------- OpenFoodFacts search-by-name (fallback when no barcode) ----------

type OFFSearchProduct = OFFProduct & {
  code?: string
  brands?: string
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export async function searchFoods(query: string): Promise<FoodSearchItem[]> {
  const q = query.trim()
  if (q.length < 2) return []
  try {
    const url =
      "https://world.openfoodfacts.org/cgi/search.pl?" +
      new URLSearchParams({
        search_terms: q,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "10",
        fields: "product_name,product_name_en,generic_name,brands,code,nutriments",
      }).toString()

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "DashboardApp/0.1 (personal)" },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { products?: OFFSearchProduct[] }

    const out: FoodSearchItem[] = []
    for (const p of json.products ?? []) {
      const name =
        p.product_name?.trim() ||
        p.product_name_en?.trim() ||
        p.generic_name?.trim() ||
        ""
      if (!name) continue
      const n = p.nutriments ?? {}
      out.push({
        name,
        brand: p.brands?.split(",")[0]?.trim() || null,
        calories: round1(Number(n["energy-kcal_100g"] ?? 0)),
        protein: round1(Number(n.proteins_100g ?? 0)),
        carbs: round1(Number(n.carbohydrates_100g ?? 0)),
        fat: round1(Number(n.fat_100g ?? 0)),
        barcode: p.code?.trim() || null,
      })
      if (out.length >= 8) break
    }
    return out
  } catch {
    return []
  }
}
