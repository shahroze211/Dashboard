// One-off cleanup: removes the initial 8 fake-seeded deadlines so only real data remains.
// Run: pnpm tsx src/db/wipe-seed-deadlines.ts

import "./load-env"
import { inArray } from "drizzle-orm"
import { db } from "./index"
import { deadlines } from "./schema"

const seedTitles = [
  "Pay phone bill",
  "Submit OS assignment",
  "Anthropic application deadline",
  "Linear algebra midterm",
  "Renew domain",
  "Capstone project proposal",
  "Vercel job application",
  "FAFSA update",
]

async function main() {
  const rows = await db
    .delete(deadlines)
    .where(inArray(deadlines.title, seedTitles))
    .returning({ id: deadlines.id, title: deadlines.title })
  for (const r of rows) console.log(`  deleted ${r.id}: ${r.title}`)
  console.log(`Deleted ${rows.length} rows.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
