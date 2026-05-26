import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 py-20">
      <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        That route doesn&apos;t exist.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  )
}
