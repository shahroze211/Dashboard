// One-off backfill: tag the M.Sc. application deadlines with subcategory "Uni Applications".
// Run: pnpm tsx src/db/backfill-uni-subcategory.ts

import "./load-env"
import { ilike } from "drizzle-orm"
import { db } from "./index"
import { deadlines } from "./schema"

async function main() {
  // All inserted uni rows have titles starting with "Uni " or "BTU " or "RPTU " or "TU ".
  // Match by title prefix patterns we used.
  const patterns = ["Uni %", "BTU %", "RPTU %", "TU Chemnitz%"]
  let total = 0
  for (const p of patterns) {
    const rows = await db
      .update(deadlines)
      .set({ subcategory: "Uni Applications", updatedAt: new Date() })
      .where(ilike(deadlines.title, p))
      .returning({ id: deadlines.id, title: deadlines.title })
    for (const r of rows) console.log(`  ${r.id}  ${r.title}`)
    total += rows.length
  }
  console.log(`Updated ${total} rows.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
