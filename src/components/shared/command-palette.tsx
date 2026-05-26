"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Briefcase,
  CalendarClock,
  Target,
  Dumbbell,
  Apple,
  Github,
  Moon,
  Sun,
  Plus,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const run = useCallback((fn: () => void) => {
    setOpen(false)
    requestAnimationFrame(fn)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search anywhere · type to filter…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run(() => router.push("/"))}>
            <LayoutDashboard />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/jobs"))}>
            <Briefcase />
            Jobs
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/deadlines"))}>
            <CalendarClock />
            Deadlines
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/goals"))}>
            <Target />
            Goals
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/gym"))}>
            <Dumbbell />
            Gym
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/nutrition"))}>
            <Apple />
            Nutrition
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Add new">
          <CommandItem
            onSelect={() => run(() => router.push("/jobs?add=1"))}
          >
            <Plus />
            Add job application
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => router.push("/deadlines?add=1"))}
          >
            <Plus />
            Add deadline
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/goals?add=1"))}>
            <Plus />
            Add goal
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/gym?add=1"))}>
            <Plus />
            Log workout
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => router.push("/nutrition?add=1"))}
          >
            <Plus />
            Log food
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() =>
              run(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? <Sun /> : <Moon />}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem
            onSelect={() =>
              run(() =>
                window.open(
                  "https://github.com/shahroze211/Dashboard",
                  "_blank",
                  "noopener,noreferrer"
                )
              )
            }
          >
            <Github />
            View source on GitHub
            <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
