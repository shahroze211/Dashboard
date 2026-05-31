// Read-only Google Sheets → dashboard bridge. Pulls a range of cells from a
// single sheet via the official Sheets API v4 and surfaces them in a home
// widget. Server-side fetch + cache, mirroring the other external-API helpers.
//
// Read-only by design: this uses a plain API key (no OAuth), so the target
// sheet must be shared "anyone with the link can view". Configure with:
//   GOOGLE_SHEETS_API_KEY  — a Google Cloud API key with the Sheets API enabled
//   GOOGLE_SHEET_ID        — the id from the sheet URL (/d/<id>/edit)
//   GOOGLE_SHEET_RANGE     — optional A1 range, e.g. "Sheet1!A1:D20" (default A1:Z100)
//   GOOGLE_SHEET_LABEL     — optional widget title (default "Sheet")
// With no key/id the widget shows an honest "not connected" state.

const DEFAULT_RANGE = "A1:Z100"

export type SheetData =
  | { ok: true; header: string[] | null; rows: string[][]; total: number }
  | { ok: false; reason: "no-config" | "error" }

export function isSheetConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_API_KEY && process.env.GOOGLE_SHEET_ID)
}

export function sheetLabel(): string {
  return process.env.GOOGLE_SHEET_LABEL?.trim() || "Sheet"
}

export function sheetUrl(): string | null {
  const id = process.env.GOOGLE_SHEET_ID
  return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null
}

export async function getSheetData(maxRows = 6): Promise<SheetData> {
  const key = process.env.GOOGLE_SHEETS_API_KEY
  const id = process.env.GOOGLE_SHEET_ID
  if (!key || !id) return { ok: false, reason: "no-config" }

  const range = process.env.GOOGLE_SHEET_RANGE?.trim() || DEFAULT_RANGE

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        id
      )}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(key)}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return { ok: false, reason: "error" }
    const json = (await res.json()) as { values?: unknown }
    const values = Array.isArray(json.values)
      ? (json.values as unknown[][]).map((row) =>
          row.map((cell) => (cell == null ? "" : String(cell)))
        )
      : []

    if (values.length === 0) {
      return { ok: true, header: null, rows: [], total: 0 }
    }

    const [first, ...rest] = values
    // Treat the first row as a header only when there are data rows beneath it.
    const header = rest.length > 0 ? first : null
    const dataRows = header ? rest : values
    return {
      ok: true,
      header,
      rows: dataRows.slice(0, maxRows),
      total: dataRows.length,
    }
  } catch {
    return { ok: false, reason: "error" }
  }
}
