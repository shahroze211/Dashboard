import { ArrowUpRight, FileSpreadsheet } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSheetData, sheetLabel, sheetUrl } from "@/lib/sheets"

export async function SheetWidget() {
  const data = await getSheetData()
  const label = sheetLabel()
  const url = sheetUrl()

  const body = (
    <Card className="h-full transition-colors group-hover:border-foreground/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
          {label}
        </CardTitle>
        {url ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        {!data.ok ? (
          <p className="text-sm text-muted-foreground">
            {data.reason === "no-config"
              ? "Not connected. Set GOOGLE_SHEET_ID + GOOGLE_SHEETS_API_KEY."
              : "Couldn’t reach the sheet."}
          </p>
        ) : data.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">The sheet is empty.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-sm">
              {data.header ? (
                <thead>
                  <tr>
                    {data.header.map((cell, i) => (
                      <th
                        key={i}
                        className="px-1 pb-1.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {data.rows.map((row, r) => (
                  <tr key={r} className="border-t border-border/50">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="truncate px-1 py-1.5 text-foreground/90"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.total > data.rows.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                +{data.total - data.rows.length} more rows
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (!url) return body

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {body}
    </a>
  )
}
