import "dotenv/config"
import { db } from "./index"
import {
  jobs,
  deadlines,
  goals,
  gymEntries,
  nutritionEntries,
} from "./schema"
import type {
  JobStatus,
  JobSource,
  DeadlineCategory,
  GoalTimeframe,
} from "@/lib/constants"

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function hoursFromNow(n: number): Date {
  const d = new Date()
  d.setHours(d.getHours() + n)
  return d
}

function startOfMonth(): Date {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function startOfQuarter(): Date {
  const d = new Date()
  return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)
}

function startOfYear(): Date {
  return new Date(new Date().getFullYear(), 0, 1)
}

// ---------- Job seeds ----------
const jobSeeds: Array<{
  company: string
  role: string
  status: JobStatus
  appliedAt: Date
  source?: JobSource
  link?: string
  location?: string
  salary?: string
  notes?: string
}> = [
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

// ---------- Deadline seeds ----------
const deadlineSeeds: Array<{
  title: string
  category: DeadlineCategory
  dueAt: Date
  notes?: string
  done?: boolean
}> = [
  { title: "Pay phone bill", category: "bill", dueAt: hoursFromNow(-26) },
  { title: "Submit OS assignment", category: "assignment", dueAt: hoursFromNow(6) },
  { title: "Anthropic application deadline", category: "application", dueAt: hoursFromNow(20) },
  { title: "Linear algebra midterm", category: "exam", dueAt: hoursFromNow(72) },
  { title: "Renew domain", category: "bill", dueAt: hoursFromNow(120) },
  { title: "Capstone project proposal", category: "assignment", dueAt: hoursFromNow(240) },
  { title: "Vercel job application", category: "application", dueAt: hoursFromNow(-72), done: true },
  { title: "FAFSA update", category: "other", dueAt: hoursFromNow(-200), done: true },
]

// ---------- Goal seeds ----------
const goalSeeds: Array<{
  title: string
  timeframe: GoalTimeframe
  periodStart: Date
  target?: number
  progress?: number
  unit?: string
  done?: boolean
  notes?: string
}> = [
  { title: "Read 24 books", timeframe: "year", periodStart: startOfYear(), target: 24, progress: 9, unit: "books" },
  { title: "Ship the dashboard", timeframe: "quarter", periodStart: startOfQuarter(), notes: "This project." },
  { title: "Run 50 miles", timeframe: "month", periodStart: startOfMonth(), target: 50, progress: 18, unit: "miles" },
  { title: "Apply to 50 jobs", timeframe: "month", periodStart: startOfMonth(), target: 50, progress: 15, unit: "apps" },
  { title: "Finish 'Crafting Interpreters'", timeframe: "quarter", periodStart: startOfQuarter(), target: 14, progress: 14, unit: "chapters", done: true },
]

// ---------- Gym seeds ----------
const gymSeeds: Array<{
  exercise: string
  sets: number
  reps: number
  weight?: number
  unit?: string
  performedAt: Date
  notes?: string
}> = [
  { exercise: "Bench press", sets: 3, reps: 8, weight: 60, performedAt: daysAgo(0), notes: "felt good" },
  { exercise: "Squat", sets: 5, reps: 5, weight: 80, performedAt: daysAgo(0) },
  { exercise: "Pullups", sets: 3, reps: 8, performedAt: daysAgo(0) },
  { exercise: "Overhead press", sets: 3, reps: 6, weight: 40, performedAt: daysAgo(2) },
  { exercise: "Deadlift", sets: 3, reps: 3, weight: 100, performedAt: daysAgo(2) },
  { exercise: "Bench press", sets: 3, reps: 8, weight: 57.5, performedAt: daysAgo(4) },
  { exercise: "Squat", sets: 5, reps: 5, weight: 77.5, performedAt: daysAgo(4) },
  { exercise: "Pullups", sets: 3, reps: 7, performedAt: daysAgo(6) },
]

// ---------- Nutrition seeds ----------
function today(hour: number, minute = 0) {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d
}

const nutritionSeeds: Array<{
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize?: string
  loggedAt: Date
}> = [
  { name: "Oatmeal with berries", calories: 320, protein: 11, carbs: 56, fat: 6, servingSize: "1 bowl", loggedAt: today(8, 15) },
  { name: "Greek yogurt", calories: 130, protein: 15, carbs: 9, fat: 4, servingSize: "170g", loggedAt: today(10, 30) },
  { name: "Chicken & rice", calories: 620, protein: 48, carbs: 78, fat: 12, servingSize: "1 plate", loggedAt: today(13, 0) },
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0.3, servingSize: "1 medium", loggedAt: today(16, 0) },
  { name: "Protein shake", calories: 180, protein: 30, carbs: 8, fat: 2, servingSize: "1 scoop + milk", loggedAt: today(18, 30) },
]

async function main() {
  console.log("Wiping all tables…")
  await db.delete(nutritionEntries)
  await db.delete(gymEntries)
  await db.delete(goals)
  await db.delete(deadlines)
  await db.delete(jobs)

  console.log(`Inserting ${jobSeeds.length} jobs…`)
  await db.insert(jobs).values(jobSeeds)

  console.log(`Inserting ${deadlineSeeds.length} deadlines…`)
  await db.insert(deadlines).values(deadlineSeeds)

  console.log(`Inserting ${goalSeeds.length} goals…`)
  await db.insert(goals).values(goalSeeds)

  console.log(`Inserting ${gymSeeds.length} gym entries…`)
  await db.insert(gymEntries).values(
    gymSeeds.map((g) => ({
      ...g,
      weight: g.weight != null ? String(g.weight) : null,
      unit: g.unit ?? "kg",
    }))
  )

  console.log(`Inserting ${nutritionSeeds.length} nutrition entries…`)
  await db.insert(nutritionEntries).values(nutritionSeeds)

  console.log("Done.")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
