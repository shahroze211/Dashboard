"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

function domainFromLink(link: string | null): string | null {
  if (!link) return null
  try {
    return new URL(link).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

// LinkedIn / generic job-board domains shouldn't drive the logo — they'd all
// render the board's icon instead of the company's.
const GENERIC_DOMAINS = new Set([
  "linkedin.com",
  "lnkd.in",
  "greenhouse.io",
  "boards.greenhouse.io",
  "job-boards.greenhouse.io",
  "lever.co",
  "jobs.lever.co",
  "ashbyhq.com",
  "jobs.ashbyhq.com",
  "workable.com",
  "apply.workable.com",
  "indeed.com",
])

function faviconSources(domain: string): string[] {
  return [
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      domain
    )}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
  ]
}

export function CompanyLogo({
  company,
  link,
  domain,
  className,
}: {
  company: string
  link?: string | null
  /** Explicit company domain; preferred over deriving from the link. */
  domain?: string | null
  className?: string
}) {
  const resolvedDomain = useMemo(() => {
    if (domain) return domain.replace(/^https?:\/\//, "").replace(/^www\./, "")
    const fromLink = domainFromLink(link ?? null)
    if (fromLink && !GENERIC_DOMAINS.has(fromLink)) return fromLink
    return null
  }, [domain, link])

  const sources = useMemo(
    () => (resolvedDomain ? faviconSources(resolvedDomain) : []),
    [resolvedDomain]
  )
  const [sourceIndex, setSourceIndex] = useState(0)

  const monogram = company.trim().charAt(0).toUpperCase() || "?"
  const box = "h-7 w-7 shrink-0 rounded-md border border-border bg-muted"

  if (sources.length === 0 || sourceIndex >= sources.length) {
    return (
      <span
        aria-hidden
        className={cn(
          box,
          "flex items-center justify-center text-[11px] font-medium text-muted-foreground",
          className
        )}
      >
        {monogram}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a tiny external favicon; routing it through next/image's optimizer is wasteful and would need remotePatterns config
    <img
      src={sources[sourceIndex]}
      alt=""
      width={28}
      height={28}
      loading="lazy"
      onError={() => setSourceIndex((i) => i + 1)}
      className={cn(box, "object-contain p-1", className)}
    />
  )
}
