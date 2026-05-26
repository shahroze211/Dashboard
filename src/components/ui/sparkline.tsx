import { cn } from "@/lib/utils"

/**
 * Minimal monochrome sparkline. Pure SVG so it renders identically on server
 * and client. `data` is bucketed numeric values in time order.
 */
export function Sparkline({
  data,
  width = 120,
  height = 28,
  className,
}: {
  data: number[]
  width?: number
  height?: number
  className?: string
}) {
  if (data.length === 0) {
    return <div style={{ width, height }} className={className} />
  }
  const max = Math.max(...data, 1)
  const stepX = data.length > 1 ? width / (data.length - 1) : width
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - (v / max) * (height - 2) - 1
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const linePath = `M ${points.join(" L ")}`
  const areaPath = `${linePath} L ${width.toFixed(2)},${height.toFixed(2)} L 0,${height.toFixed(2)} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-foreground/80", className)}
      aria-hidden="true"
    >
      <path d={areaPath} fill="currentColor" fillOpacity={0.08} />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
