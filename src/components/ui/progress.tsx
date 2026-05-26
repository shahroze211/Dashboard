import { cn } from "@/lib/utils"

export function Progress({
  value,
  className,
  trackClassName,
  barClassName,
}: {
  value: number
  className?: string
  trackClassName?: string
  barClassName?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        trackClassName,
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-foreground transition-[width] duration-300 ease-out",
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
