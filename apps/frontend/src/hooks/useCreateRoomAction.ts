"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { toast } from "sonner"
import type { Room } from "@/lib/types/room"

interface CreateRoomState {
  error: string | null
  fieldErrors: {
    title?: string
    description?: string
  }
}

const INITIAL_STATE: CreateRoomState = { error: null, fieldErrors: {} }
const ROOMS_ENDPOINT = "/api/rooms"
const DASHBOARD_ROUTE = "/dashboard"
const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500

export function useCreateRoomAction() {
  const router = useRouter()

  async function createRoomAction(
    _prevState: CreateRoomState,
    formData: FormData,
  ): Promise<CreateRoomState> {
    const rawTitle = formData.get("title")
    const rawDescription = formData.get("description")

    if (typeof rawTitle !== "string" || !rawTitle.trim()) {
      return { error: null, fieldErrors: { title: "Title is required." } }
    }

    const title = rawTitle.trim()
    const description =
      typeof rawDescription === "string" ? rawDescription.trim() : undefined

    const fieldErrors: CreateRoomState["fieldErrors"] = {}

    if (title.length > TITLE_MAX_LENGTH) {
      fieldErrors.title = `Title must not exceed ${TITLE_MAX_LENGTH} characters.`
    }

    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      fieldErrors.description = `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors }
    }

    try {
      await axiosInstance.post<{
        status: string
        data: Room
      }>(ROOMS_ENDPOINT, { title, description: description || undefined })

      toast.success("Room created successfully!")
      router.push(DASHBOARD_ROUTE)

      return INITIAL_STATE
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create room."
      toast.error(message)
      return INITIAL_STATE
    }
  }

  const [state, action] = useActionState(createRoomAction, INITIAL_STATE)

  return { state, action }
}
