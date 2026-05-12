"use client"

import { use, useState, useTransition } from "react"
import { axiosInstance } from "@/lib/api-client"
import type { Room } from "@/lib/types/room"
import type { ApiResponse } from "@/lib/types/api"

const ROOMS_ENDPOINT = "/api/rooms/mine"

/**
 * Promise cache — ensures `use()` receives a STABLE promise reference.
 *
 * Without this, React re-renders after rejection → useState initializer
 * creates a NEW promise → use() suspends again → infinite loop.
 * The cache ensures the SAME rejected promise is returned on re-render,
 * so use() throws the cached error → ErrorBoundary catches it.
 *
 * @see https://react.dev/reference/react/use#caveats
 */
const promiseCache = new Map<string, Promise<Room[]>>()

function fetchRooms(key: string = "rooms"): Promise<Room[]> {
  const cached = promiseCache.get(key)
  if (cached) return cached

  const promise = axiosInstance
    .get<ApiResponse<Room[]>>(ROOMS_ENDPOINT)
    .then((response) => response.data.data)

  promiseCache.set(key, promise)
  return promise
}

/**
 * Invalidate the cache and create a fresh promise.
 * Used by `refetch()` to force a new network request.
 */
function invalidateRooms(): Promise<Room[]> {
  promiseCache.delete("rooms")
  return fetchRooms("rooms")
}

/**
 * React 19 data hook — uses `use()` to suspend while the promise is pending.
 *
 * - On mount: `useState` initializer calls `fetchRooms()` which returns a CACHED promise
 * - While pending: `use()` throws the thenable → Suspense catches it
 * - On resolve: `use()` returns the data → component renders
 * - On reject: `use()` throws the SAME cached error → ErrorBoundary catches it (no loop)
 * - `refetch()` invalidates cache + creates a new promise via `startTransition`
 */
export function useRooms() {
  const [roomsPromise, setRoomsPromise] = useState(() => fetchRooms())
  const [isRefetching, startTransition] = useTransition()

  const rooms = use(roomsPromise)

  function refetch() {
    startTransition(() => {
      setRoomsPromise(invalidateRooms())
    })
  }

  return { rooms, isRefetching, refetch }
}
