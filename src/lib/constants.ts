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

export const JOB_SOURCES = ["linkedin", "company-site", "referral", "other"] as const
export type JobSource = (typeof JOB_SOURCES)[number]

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  "company-site": "Company site",
  referral: "Referral",
  other: "Other",
}
