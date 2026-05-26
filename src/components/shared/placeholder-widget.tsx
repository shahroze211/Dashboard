import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PlaceholderWidget({
  title,
  hint,
  href,
}: {
  title: string
  hint: string
  href: string
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-colors group-hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{title}</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
