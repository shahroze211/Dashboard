import { formatDistanceToNowStrict } from "date-fns"
import { ExternalLink, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import type { DiscoverResult } from "@/lib/jobs-discover"
import { CompanyLogo } from "./company-logo"
import { SaveDiscoveredButton } from "./save-discovered-button"

export function DiscoverList({
  result,
  hasQuery,
}: {
  result: DiscoverResult
  hasQuery: boolean
}) {
  if (!result.ok && result.reason === "no-key") {
    return (
      <EmptyState
        title="Discover isn’t configured"
        description="Set a free JSEARCH_API_KEY (RapidAPI) in your environment to pull live roles from LinkedIn, Indeed and other boards."
      />
    )
  }

  if (!result.ok) {
    return (
      <EmptyState
        title="Couldn’t reach the job feed"
        description="The discover service didn’t respond. Try again in a moment."
      />
    )
  }

  if (!hasQuery) {
    return (
      <EmptyState
        title="Search to discover roles"
        description="Enter a role above to pull live postings aggregated from LinkedIn, Indeed, Glassdoor and more."
      />
    )
  }

  if (result.jobs.length === 0) {
    return (
      <EmptyState
        title="No matches"
        description="Nothing came back for that search. Try broader keywords or a different location."
      />
    )
  }

  return (
    <div className="grid gap-3">
      {result.jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-start gap-3 rounded-lg border border-border p-3"
        >
          <CompanyLogo
            company={job.company}
            link={job.link}
            domain={job.logoDomain}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <p className="truncate font-medium">{job.title}</p>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {job.company}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {job.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              ) : null}
              {job.salary ? <span>{job.salary}</span> : null}
              {job.postedAt ? (
                <span>
                  {formatDistanceToNowStrict(new Date(job.postedAt))} ago
                </span>
              ) : null}
              {job.publisher ? (
                <Badge variant="muted">{job.publisher}</Badge>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {job.link ? (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Open posting"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
            <SaveDiscoveredButton job={job} />
          </div>
        </div>
      ))}
    </div>
  )
}
