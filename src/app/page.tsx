import { PageHeader } from "@/components/shared/page-header"
import { JobsWidget } from "./jobs/components/jobs-widget"
import { DeadlinesWidget } from "./deadlines/components/deadlines-widget"
import { GoalsWidget } from "./goals/components/goals-widget"
import { GymWidget } from "./gym/components/gym-widget"
import { NutritionWidget } from "./nutrition/components/nutrition-widget"

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
        <DeadlinesWidget />
        <GoalsWidget />
        <GymWidget />
        <NutritionWidget />
      </div>
    </div>
  )
}
