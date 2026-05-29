// ---------- Jobs ----------
export const JOB_STATUSES = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "ghosted",
  "withdrawn",
] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
  withdrawn: "Withdrawn",
}

export const JOB_SOURCES = [
  "linkedin",
  "company-site",
  "referral",
  "other",
] as const
export type JobSource = (typeof JOB_SOURCES)[number]

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  "company-site": "Company site",
  referral: "Referral",
  other: "Other",
}

export const JOB_CATEGORIES = ["ai-ml", "swe", "data", "fullstack"] as const
export type JobCategory = (typeof JOB_CATEGORIES)[number]

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  "ai-ml": "AI / ML",
  swe: "Software Engineering",
  data: "Data",
  fullstack: "Full-stack",
}

// ---------- Deadlines ----------
export const DEADLINE_CATEGORIES = [
  "assignment",
  "exam",
  "application",
  "bill",
  "other",
] as const
export type DeadlineCategory = (typeof DEADLINE_CATEGORIES)[number]

export const DEADLINE_CATEGORY_LABELS: Record<DeadlineCategory, string> = {
  assignment: "Assignment",
  exam: "Exam",
  application: "Application",
  bill: "Bill",
  other: "Other",
}

// ---------- Goals ----------
export const GOAL_TIMEFRAMES = ["year", "quarter", "month"] as const
export type GoalTimeframe = (typeof GOAL_TIMEFRAMES)[number]

export const GOAL_TIMEFRAME_LABELS: Record<GoalTimeframe, string> = {
  year: "Year",
  quarter: "Quarter",
  month: "Month",
}

// ---------- Gym ----------
export const WEIGHT_UNITS = ["kg", "lbs"] as const
export type WeightUnit = (typeof WEIGHT_UNITS)[number]

// ---------- Nutrition ----------
// Single-user targets. Edit here to change.
export const NUTRITION_TARGETS = {
  calories: 2400,
  protein: 160, // grams
  carbs: 280, // grams
  fat: 80, // grams
} as const

export type NutritionTarget = keyof typeof NUTRITION_TARGETS
