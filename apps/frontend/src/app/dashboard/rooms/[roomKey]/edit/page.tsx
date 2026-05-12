import { Suspense } from "react"
import { EditRoomLoader } from "@/components/views/dashboard/EditRoomLoader"
import { DashboardError } from "@/components/views/dashboard/DashboardError"
import { EditRoomSkeleton } from "@/components/views/dashboard/EditRoomSkeleton"

export default function EditRoomPage() {
  return (
    <DashboardError>
      <Suspense fallback={<EditRoomSkeleton />}>
        <EditRoomLoader />
      </Suspense>
    </DashboardError>
  )
}
