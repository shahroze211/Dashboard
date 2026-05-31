// Job discovery via the JSearch API (RapidAPI), which aggregates live postings
// from LinkedIn, Indeed, Glassdoor, ZipRecruiter and others. Server-side fetch
// + 1h cache, mirroring the OpenFoodFacts / Nager.Date keyless-API pattern —
// except JSearch needs a key, read from JSEARCH_API_KEY. Without a key every
// call returns an honest empty result so the UI can say "not configured"
// rather than crash. This is a discover-and-save feed (you search, you click
// "Save to tracker"), not a silent background auto-import — see the deviation
// note in PROJECT.md.

const JSEARCH_HOST = "jsearch.p.rapidapi.com"

export type DiscoveredJob = {
  id: string
  title: string
  company: string
  location: string | null
  link: string | null
  /** Original board the posting came from, e.g. "LinkedIn", "Indeed". */
  publisher: string | null
  /** Best-guess company domain for the favicon logo. */
  logoDomain: string | null
  /** ISO timestamp, or null if the feed didn't provide one. */
  postedAt: string | null
  salary: string | null
  remote: boolean
}

export type DiscoverResult =
  | { ok: true; jobs: DiscoveredJob[] }
  | { ok: false; reason: "no-key" | "error"; jobs: [] }

// Only the fields we actually read. Everything is optional — the feed is
// external and not guaranteed to populate any given field.
type RawJob = {
  job_id?: string
  job_title?: string
  employer_name?: string
  employer_website?: string | null
  job_publisher?: string | null
  job_apply_link?: string | null
  job_city?: string | null
  job_state?: string | null
  job_country?: string | null
  job_is_remote?: boolean
  job_posted_at_datetime_utc?: string | null
  job_min_salary?: number | null
  job_max_salary?: number | null
  job_salary_currency?: string | null
  job_salary_period?: string | null
}

function domainFromUrl(url?: string | null): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function buildLocation(j: RawJob): string | null {
  if (j.job_is_remote) return "Remote"
  const parts = [j.job_city, j.job_state, j.job_country].filter(
    (p): p is string => Boolean(p)
  )
  return parts.length ? parts.join(", ") : null
}

function compact(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n))
}

function formatSalary(j: RawJob): string | null {
  const min = j.job_min_salary ?? null
  const max = j.job_max_salary ?? null
  if (!min && !max) return null
  const currency = j.job_salary_currency ? `${j.job_salary_currency} ` : ""
  const range =
    min && max ? `${compact(min)}–${compact(max)}` : compact((min ?? max) as number)
  const period = j.job_salary_period
    ? `/${j.job_salary_period.toLowerCase()}`
    : ""
  return `${currency}${range}${period}`
}

function normalize(j: RawJob, index: number): DiscoveredJob {
  return {
    id: j.job_id ?? `idx-${index}`,
    title: j.job_title ?? "Untitled role",
    company: j.employer_name ?? "Unknown company",
    location: buildLocation(j),
    link: j.job_apply_link ?? null,
    publisher: j.job_publisher ?? null,
    logoDomain: domainFromUrl(j.employer_website),
    postedAt: j.job_posted_at_datetime_utc ?? null,
    salary: formatSalary(j),
    remote: Boolean(j.job_is_remote),
  }
}

export async function searchJobs(opts: {
  query: string
  location?: string
  page?: number
}): Promise<DiscoverResult> {
  const key = process.env.JSEARCH_API_KEY
  if (!key) return { ok: false, reason: "no-key", jobs: [] }
  if (!opts.query.trim()) return { ok: true, jobs: [] }

  const q = [opts.query.trim(), opts.location?.trim()]
    .filter(Boolean)
    .join(" in ")
  const params = new URLSearchParams({
    query: q,
    page: String(opts.page ?? 1),
    num_pages: "1",
  })

  try {
    const res = await fetch(`https://${JSEARCH_HOST}/search?${params}`, {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": JSEARCH_HOST,
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return { ok: false, reason: "error", jobs: [] }
    const json = (await res.json()) as { data?: RawJob[] }
    const jobs = Array.isArray(json.data) ? json.data.map(normalize) : []
    return { ok: true, jobs }
  } catch {
    return { ok: false, reason: "error", jobs: [] }
  }
}
