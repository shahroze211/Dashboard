import { PageHeader } from "@/components/shared/page-header"
import { PlaceholderWidget } from "@/components/shared/placeholder-widget"
import { JobsWidget } from "./jobs/components/jobs-widget"

export const dynamic = "force-dynamic"

export default function DashboardHome() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="A calm read of how I'm doing."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <JobsWidget />
        <PlaceholderWidget
          title="Deadlines"
          hint="Coming next."
          href="/deadlines"
        />
        <PlaceholderWidget
          title="Goals"
          hint="Not built yet."
          href="/goals"
        />
        <PlaceholderWidget title="Gym" hint="Not built yet." href="/gym" />
        <PlaceholderWidget
          title="Nutrition"
          hint="Not built yet."
          href="/nutrition"
        />
      </div>
    </div>
  )
}
