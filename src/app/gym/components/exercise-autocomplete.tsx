"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { searchExercises } from "../actions"
import type { ExerciseSuggestion } from "../types"

export function ExerciseAutocomplete({
  value,
  onChange,
  onPickCategory,
}: {
  value: string
  onChange: (v: string) => void
  onPickCategory: (category: string | null) => void
}) {
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const skipNext = useRef(false)

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false
      return
    }
    const q = value.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    let active = true
    const id = setTimeout(async () => {
      const res = await searchExercises(q)
      if (!active) return
      setSuggestions(res)
      setOpen(res.length > 0)
    }, 280)
    return () => {
      active = false
      clearTimeout(id)
    }
  }, [value])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const pick = (s: ExerciseSuggestion) => {
    skipNext.current = true
    onChange(s.name)
    onPickCategory(s.category)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={boxRef} className="relative">
      <Input
        autoFocus
        autoComplete="off"
        placeholder="Bench press"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
      />
      {open ? (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-popover py-1 shadow-md animate-fade-in">
          {suggestions.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => pick(s)}
                className="flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span className="truncate">{s.name}</span>
                {s.category ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {s.category}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
