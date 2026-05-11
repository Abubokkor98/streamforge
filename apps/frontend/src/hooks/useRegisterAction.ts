"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { setAccessToken } from "@/lib/auth-store"
import { validatePassword, validatePasswordMatch } from "@/lib/validation"

interface RegisterState {
  error: string | null
  fieldErrors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
}

interface RegisterResponse {
  user: {
    id: number
    name: string
    email: string
  }
  accessToken: string
}

const INITIAL_STATE: RegisterState = { error: null, fieldErrors: {} }
const DASHBOARD_ROUTE = "/dashboard"

function validateRegistration(formData: FormData): RegisterState | null {
  const name = formData.get("name") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const fieldErrors: RegisterState["fieldErrors"] = {}

  if (!name?.trim()) {
    fieldErrors.name = "Name is required."
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    fieldErrors.password = passwordError
  }

  const matchError = validatePasswordMatch(password, confirmPassword)
  if (matchError) {
    fieldErrors.confirmPassword = matchError
  }

  const hasErrors = Object.keys(fieldErrors).length > 0
  return hasErrors ? { error: null, fieldErrors } : null
}

export function useRegisterAction() {
  const router = useRouter()

  async function registerAction(
    _prevState: RegisterState,
    formData: FormData,
  ): Promise<RegisterState> {
    const validationError = validateRegistration(formData)
    if (validationError) {
      return validationError
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const data = await apiClient<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      })

      setAccessToken(data.accessToken)
      router.push(DASHBOARD_ROUTE)

      return INITIAL_STATE
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed."

      if (message.toLowerCase().includes("already")) {
        return { error: null, fieldErrors: { email: message } }
      }

      return { error: message, fieldErrors: {} }
    }
  }

  const [state, action] = useActionState(registerAction, INITIAL_STATE)

  return { state, action }
}
