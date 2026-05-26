import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export default function GoalsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Goals" />
      <EmptyState
        title="Coming soon"
        description="This module is on the roadmap. See STATUS.md."
      />
    </div>
  )
}
