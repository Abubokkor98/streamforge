"use client"

import { useRooms } from "@/hooks/useRooms"
import { RoomCard } from "@/components/views/dashboard/RoomCard"
import { DashboardSkeleton } from "@/components/views/dashboard/DashboardSkeleton"
import { CreateRoomDialog } from "@/components/views/dashboard/CreateRoomDialog"
import { Button } from "@/components/ui/button"

/**
 * Handles its own loading/error states via useRooms hook.
 * No Suspense/ErrorBoundary needed — React Query manages loading/error states internally.
 */
function DashboardView() {
  const { rooms, isLoading, error, refetch } = useRooms()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <section className="flex flex-col items-center gap-4 py-20 text-center">
        <h2 className="text-lg font-semibold text-destructive">
          Failed to load rooms
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error?.message ?? "Something went wrong."}
        </p>
        <Button onClick={refetch} variant="outline">
          Try again
        </Button>
      </section>
    )
  }

  if (rooms.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-20 text-center">
        <h2 className="text-lg font-semibold text-foreground">No rooms yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create your first streaming room to get started.
        </p>
        <CreateRoomDialog />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Rooms</h2>
        <CreateRoomDialog
          trigger={
            <Button size="sm" className="gap-2">
              Create Room
            </Button>
          }
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onDeleted={refetch} />
        ))}
      </div>
    </section>
  )
}

export { DashboardView }
