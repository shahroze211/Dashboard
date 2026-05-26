import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export default function NutritionPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Nutrition" />
      <EmptyState
        title="Coming soon"
        description="This module is on the roadmap. See STATUS.md."
      />
    </div>
  )
}
