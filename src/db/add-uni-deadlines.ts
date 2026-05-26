// One-off script: adds Shahroze's 10 M.Sc. application deadlines (Germany) to the deadlines table.
// Run: pnpm tsx src/db/add-uni-deadlines.ts

import "./load-env"
import { db } from "./index"
import { deadlines } from "./schema"
import type { DeadlineCategory } from "@/lib/constants"

// Month is 0-indexed in Date.UTC: June=5, July=6, September=8.
const Jun30 = new Date(Date.UTC(2026, 5, 30, 23, 59, 0))
const Jul15 = new Date(Date.UTC(2026, 6, 15, 23, 59, 0))
const Sep15 = new Date(Date.UTC(2026, 8, 15, 23, 59, 0))

const data: Array<{
  title: string
  category: DeadlineCategory
  dueAt: Date
  notes: string
}> = [
  {
    title: "Uni Münster — M.Sc. Information Systems",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~300 · Research/U15 · IS/AI/Data · uni-assist · ~55% chance",
  },
  {
    title: "Uni Passau — M.Sc. CS (Intelligent Technical Systems)",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~500 · Research · CS/ML · uni-assist · ~58% chance",
  },
  {
    title: "BTU Cottbus — M.Sc. Artificial Intelligence",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~800 · Research · Pure AI · uni-assist · ~45% chance",
  },
  {
    title: "RPTU Kaiserslautern — M.Sc. Computer Science",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~600 · Research · CS/AI · Direct · ~60% chance",
  },
  {
    title: "Uni Wuppertal — M.Sc. Informatik (Data Analytics)",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~600 · Research · CS/Data · uni-assist · ~65% chance",
  },
  {
    title: "TU Chemnitz — M.Sc. Data Science",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~500 · Research · DS · uni-assist · ~72% chance",
  },
  {
    title: "Uni Kassel — M.Sc. CS (Intelligent Systems)",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~600 · Research · CS/AI · uni-assist · ~65% chance",
  },
  {
    title: "Uni Hildesheim — M.Sc. Data Analytics",
    category: "application",
    dueAt: Jun30,
    notes: "QS ~700 · Research · Data/NLP · Direct · ~70% chance",
  },
  {
    title: "Uni Duisburg-Essen — M.Sc. Data Science",
    category: "application",
    dueAt: Sep15,
    notes: "QS ~500 · Research · DS · uni-assist · ~68% chance",
  },
  {
    title: "Uni Münster — M.Sc. Geoinformatics & Spatial DS",
    category: "application",
    dueAt: Jul15,
    notes: "QS ~300 · Research/U15 · Data/Geo · Direct · ~60% chance",
  },
]

async function main() {
  console.log(`Inserting ${data.length} university application deadlines…`)
  const inserted = await db.insert(deadlines).values(data).returning({ id: deadlines.id })
  console.log(`Inserted IDs: ${inserted.map((r) => r.id).join(", ")}`)
  console.log("Done.")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
