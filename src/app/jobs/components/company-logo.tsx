"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

function domainFromLink(link: string | null): string | null {
  if (!link) return null
  try {
    return new URL(link).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export function CompanyLogo({
  company,
  link,
  className,
}: {
  company: string
  link: string | null
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const domain = domainFromLink(link)
  const monogram = company.trim().charAt(0).toUpperCase() || "?"
  const box = "h-7 w-7 shrink-0 rounded-md border border-border bg-muted"

  if (!domain || failed) {
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
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        domain
      )}&sz=64`}
      alt=""
      width={28}
      height={28}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(box, "object-contain p-1", className)}
    />
  )
}
