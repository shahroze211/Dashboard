import "./load-env"
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
  JobCategory,
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
// Real companies hiring across AI/ML, SWE, Data, and Full-stack — each links to
// an accessible careers page, with the company's real domain for logo lookup.
const jobSeeds: Array<{
  company: string
  role: string
  category: JobCategory
  status: JobStatus
  appliedAt: Date
  source?: JobSource
  link?: string
  logoDomain?: string
  location?: string
  salary?: string
  notes?: string
}> = [
  // AI / ML
  { company: "OpenAI", role: "Machine Learning Engineer", category: "ai-ml", status: "interviewing", appliedAt: daysAgo(8), source: "linkedin", link: "https://openai.com/careers/", logoDomain: "openai.com", location: "San Francisco" },
  { company: "Anthropic", role: "Research Engineer", category: "ai-ml", status: "applied", appliedAt: daysAgo(3), source: "company-site", link: "https://www.anthropic.com/careers", logoDomain: "anthropic.com", location: "San Francisco" },
  { company: "Hugging Face", role: "Machine Learning Engineer", category: "ai-ml", status: "applied", appliedAt: daysAgo(5), source: "linkedin", link: "https://apply.workable.com/huggingface/", logoDomain: "huggingface.co", location: "Remote" },
  { company: "Mistral AI", role: "ML Research Engineer", category: "ai-ml", status: "applied", appliedAt: daysAgo(6), source: "linkedin", link: "https://www.mistral.ai/careers", logoDomain: "mistral.ai", location: "Paris, FR" },
  { company: "Aleph Alpha", role: "Machine Learning Engineer", category: "ai-ml", status: "interviewing", appliedAt: daysAgo(12), source: "linkedin", link: "https://jobs.ashbyhq.com/AlephAlpha", logoDomain: "aleph-alpha.com", location: "Heidelberg, DE" },

  // Software Engineering
  { company: "Stripe", role: "Software Engineer, Backend", category: "swe", status: "interviewing", appliedAt: daysAgo(9), source: "linkedin", link: "https://stripe.com/jobs", logoDomain: "stripe.com", location: "Remote" },
  { company: "GitLab", role: "Backend Engineer", category: "swe", status: "applied", appliedAt: daysAgo(4), source: "company-site", link: "https://about.gitlab.com/jobs/", logoDomain: "gitlab.com", location: "Remote" },
  { company: "GitHub", role: "Software Engineer", category: "swe", status: "ghosted", appliedAt: daysAgo(40), source: "linkedin", link: "https://www.github.careers/careers-home", logoDomain: "github.com", location: "Remote" },
  { company: "SAP", role: "Software Developer", category: "swe", status: "applied", appliedAt: daysAgo(7), source: "linkedin", link: "https://jobs.sap.com/", logoDomain: "sap.com", location: "Walldorf, DE" },
  { company: "N26", role: "Backend Engineer", category: "swe", status: "offer", appliedAt: daysAgo(20), source: "referral", link: "https://n26.com/en-eu/careers", logoDomain: "n26.com", location: "Berlin, DE", notes: "Referred by a mutual contact." },

  // Data
  { company: "Databricks", role: "Data Engineer", category: "data", status: "applied", appliedAt: daysAgo(2), source: "linkedin", link: "https://www.databricks.com/company/careers", logoDomain: "databricks.com", location: "San Francisco" },
  { company: "Snowflake", role: "Data Platform Engineer", category: "data", status: "rejected", appliedAt: daysAgo(38), source: "linkedin", link: "https://careers.snowflake.com/us/en", logoDomain: "snowflake.com", location: "Bozeman, MT" },
  { company: "Confluent", role: "Data Infrastructure Engineer", category: "data", status: "applied", appliedAt: daysAgo(10), source: "company-site", link: "https://careers.confluent.io/", logoDomain: "confluent.io", location: "Mountain View, CA" },
  { company: "dbt Labs", role: "Analytics Engineer", category: "data", status: "applied", appliedAt: daysAgo(6), source: "linkedin", link: "https://job-boards.greenhouse.io/dbtlabsinc", logoDomain: "getdbt.com", location: "Remote" },
  { company: "Celonis", role: "Data Engineer", category: "data", status: "interviewing", appliedAt: daysAgo(14), source: "linkedin", link: "https://careers.celonis.com/join-us/open-positions", logoDomain: "celonis.com", location: "Munich, DE" },

  // Full-stack
  { company: "Vercel", role: "Full-Stack Engineer", category: "fullstack", status: "applied", appliedAt: daysAgo(1), source: "company-site", link: "https://vercel.com/careers", logoDomain: "vercel.com", location: "Remote" },
  { company: "Datadog", role: "Software Engineer, Full-Stack", category: "fullstack", status: "applied", appliedAt: daysAgo(11), source: "linkedin", link: "https://careers.datadoghq.com/all-jobs/", logoDomain: "datadoghq.com", location: "New York" },
  { company: "Spotify", role: "Full-Stack Engineer", category: "fullstack", status: "rejected", appliedAt: daysAgo(30), source: "linkedin", link: "https://www.lifeatspotify.com/jobs", logoDomain: "spotify.com", location: "Stockholm, SE" },
  { company: "Zalando", role: "Frontend Engineer", category: "fullstack", status: "applied", appliedAt: daysAgo(5), source: "linkedin", link: "https://jobs.zalando.com/en/jobs/", logoDomain: "zalando.com", location: "Berlin, DE" },
  { company: "Personio", role: "Full-Stack Engineer", category: "fullstack", status: "applied", appliedAt: daysAgo(8), source: "linkedin", link: "https://www.personio.com/about-personio/careers/", logoDomain: "personio.com", location: "Munich, DE" },
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
