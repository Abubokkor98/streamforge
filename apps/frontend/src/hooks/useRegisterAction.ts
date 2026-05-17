"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { validatePassword, validatePasswordMatch } from "@/lib/validation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errors"

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
const LOGIN_ROUTE = "/login"

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
    const confirmPassword = formData.get("confirmPassword") as string

    try {
      await axiosInstance.post<{
        status: string
        data: RegisterResponse
      }>("/api/auth/register", { name, email, password, confirmPassword })

      toast.success("Account created successfully! Please sign in.")
      router.push(LOGIN_ROUTE)

      return INITIAL_STATE
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed.")

      if (message.toLowerCase().includes("already")) {
        return { error: null, fieldErrors: { email: message } }
      }

      toast.error(message)
      return INITIAL_STATE
    }
  }

  const [state, action] = useActionState(registerAction, INITIAL_STATE)

  return { state, action }
}

