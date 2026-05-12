import { Suspense } from "react"
import { DashboardView } from "@/components/views/dashboard/DashboardView"
import { DashboardError } from "@/components/views/dashboard/DashboardError"
import { DashboardSkeleton } from "@/components/views/dashboard/DashboardSkeleton"

export default function DashboardPage() {
  return (
    <DashboardError>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardView />
      </Suspense>
    </DashboardError>
  )
}
