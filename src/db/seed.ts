import "dotenv/config"
import { db } from "./index"
import { jobs } from "./schema"
import type { JobStatus, JobSource } from "@/lib/constants"

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

type Seed = {
  company: string
  role: string
  status: JobStatus
  appliedAt: Date
  link?: string
  source?: JobSource
  location?: string
  salary?: string
  notes?: string
}

const seeds: Seed[] = [
  { company: "Stripe", role: "Software Engineer, Payments", status: "interviewing", appliedAt: daysAgo(2), source: "linkedin", link: "https://stripe.com/jobs", location: "Remote" },
  { company: "Vercel", role: "Frontend Engineer", status: "applied", appliedAt: daysAgo(3), source: "company-site", link: "https://vercel.com/careers", location: "Remote" },
  { company: "Linear", role: "Product Engineer", status: "applied", appliedAt: daysAgo(4), source: "linkedin", location: "Remote" },
  { company: "Supabase", role: "Full-Stack Engineer", status: "offer", appliedAt: daysAgo(28), source: "referral", location: "Remote", salary: "Competitive", notes: "Referred by a mutual contact." },
  { company: "Anthropic", role: "Software Engineer", status: "interviewing", appliedAt: daysAgo(10), source: "company-site", location: "Hybrid – SF" },
  { company: "Cloudflare", role: "Engineering Intern", status: "rejected", appliedAt: daysAgo(40), source: "linkedin", notes: "Closed for the cycle." },
  { company: "GitHub", role: "Frontend Engineer", status: "ghosted", appliedAt: daysAgo(60), source: "linkedin" },
  { company: "Notion", role: "Junior Engineer", status: "applied", appliedAt: daysAgo(6), source: "other" },
  { company: "PlanetScale", role: "Backend Engineer", status: "withdrawn", appliedAt: daysAgo(35), source: "linkedin", notes: "Took the offer at Supabase." },
  { company: "Figma", role: "Software Engineer, Web", status: "applied", appliedAt: daysAgo(1), source: "company-site" },
  { company: "Sentry", role: "Software Engineer", status: "interviewing", appliedAt: daysAgo(14), source: "referral" },
  { company: "Replit", role: "Full-Stack Engineer", status: "applied", appliedAt: daysAgo(5), source: "linkedin", location: "Remote" },
  { company: "Cursor", role: "Frontend Engineer", status: "applied", appliedAt: daysAgo(8), source: "company-site" },
  { company: "Posthog", role: "Software Engineer", status: "rejected", appliedAt: daysAgo(45), source: "linkedin" },
  { company: "Resend", role: "Full-Stack Engineer", status: "applied", appliedAt: daysAgo(7), source: "linkedin", location: "Remote" },
]

async function main() {
  console.log("Wiping jobs table…")
  await db.delete(jobs)
  console.log(`Inserting ${seeds.length} sample applications…`)
  await db.insert(jobs).values(seeds)
  console.log("Done.")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
