"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function DiscoverSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("dq") ?? "")
  const [location, setLocation] = useState(params.get("dloc") ?? "")

  useEffect(() => {
    setQuery(params.get("dq") ?? "")
    setLocation(params.get("dloc") ?? "")
  }, [params])

  const submit = () => {
    const u = new URLSearchParams(params.toString())
    u.set("view", "discover")
    if (query.trim()) u.set("dq", query.trim())
    else u.delete("dq")
    if (location.trim()) u.set("dloc", location.trim())
    else u.delete("dloc")
    router.push(`${pathname}?${u.toString()}`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Role or keywords, e.g. machine learning engineer"
          className="h-9 w-[300px] pl-8 text-sm"
        />
      </div>
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (optional)"
        className="h-9 w-[200px] text-sm"
      />
      <Button type="submit" size="sm" className="h-9">
        Search
      </Button>
    </form>
  )
}
