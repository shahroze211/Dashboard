import { cn } from "@/lib/utils"

type Ring = {
  label: string
  actual: number
  target: number
}

/**
 * Apple Activity–style concentric rings. Pure SVG; monochrome by default.
 * Each ring depth fades slightly via opacity so the rings stay distinguishable
 * without introducing color noise.
 */
export function MacroRing({
  rings,
  size = 96,
  strokeWidth = 7,
  gap = 2.5,
  className,
}: {
  rings: Ring[]
  size?: number
  strokeWidth?: number
  gap?: number
  className?: string
}) {
  const cx = size / 2
  const cy = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {rings.map((r, i) => {
          const radius = size / 2 - strokeWidth / 2 - i * (strokeWidth + gap)
          if (radius < strokeWidth / 2) return null
          const c = 2 * Math.PI * radius
          const pct = r.target > 0 ? Math.min(1, r.actual / r.target) : 0
          const dashOffset = c * (1 - pct)
          const fgOpacity = 1 - i * 0.18
          return (
            <g key={r.label}>
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={strokeWidth}
              />
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={fgOpacity}
                strokeWidth={strokeWidth}
                strokeDasharray={c}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
