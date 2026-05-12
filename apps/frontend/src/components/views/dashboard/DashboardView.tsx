"use client"

import Link from "next/link"
import { useRooms } from "@/hooks/useRooms"
import { RoomCard } from "@/components/views/dashboard/RoomCard"
import { DashboardSkeleton } from "@/components/views/dashboard/DashboardSkeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "@phosphor-icons/react"

/**
 * Handles its own loading/error states via useRooms hook.
 * No Suspense/ErrorBoundary needed — useEffect pattern is self-contained.
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
        <Button asChild className="gap-2">
          <Link href="/dashboard/create-room">
            <PlusCircle className="size-4" aria-hidden="true" />
            Create Room
          </Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Rooms</h2>
        <Button asChild size="sm" className="gap-2">
          <Link href="/dashboard/create-room">
            <PlusCircle className="size-4" aria-hidden="true" />
            Create Room
          </Link>
        </Button>
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
