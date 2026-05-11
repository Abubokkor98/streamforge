"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { setAccessToken } from "@/lib/auth-store"

interface LoginState {
  error: string | null
}

interface LoginResponse {
  user: {
    id: number
    name: string
    email: string
  }
  accessToken: string
}

const INITIAL_STATE: LoginState = { error: null }
const DASHBOARD_ROUTE = "/dashboard"

export function useLoginAction() {
  const router = useRouter()

  async function loginAction(
    _prevState: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required." }
    }

    try {
      const data = await apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      })

      setAccessToken(data.accessToken)
      router.push(DASHBOARD_ROUTE)

      return { error: null }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Try again."
      return { error: message }
    }
  }

  const [state, action] = useActionState(loginAction, INITIAL_STATE)

  return { state, action }
}
