"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

/**
 * Watches the URL for a given query param and opens a dialog when present,
 * then strips the param so reload doesn't re-open. Used by Add buttons to
 * react to /<module>?add=1 deep-links from the command palette.
 */
export function useAutoOpenFromQuery(
  queryKey: string,
  setOpen: (open: boolean) => void
) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (params.get(queryKey)) {
      setOpen(true)
      const u = new URLSearchParams(params.toString())
      u.delete(queryKey)
      const qs = u.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    }
  }, [params, queryKey, setOpen, router, pathname])
}
