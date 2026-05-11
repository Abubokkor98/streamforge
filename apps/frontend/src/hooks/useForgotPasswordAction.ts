"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { safeSessionStorage } from "@/lib/safe-storage"

interface ForgotPasswordState {
  error: string | null
  success: boolean
}

const INITIAL_STATE: ForgotPasswordState = { error: null, success: false }
const VERIFY_OTP_ROUTE = "/verify-otp"
const STORAGE_KEY_EMAIL = "reset-email"

export function useForgotPasswordAction() {
  const router = useRouter()

  async function forgotPasswordAction(
    _prevState: ForgotPasswordState,
    formData: FormData,
  ): Promise<ForgotPasswordState> {
    const email = formData.get("email")

    if (typeof email !== "string" || !email.trim()) {
      return { error: "Email is required.", success: false }
    }

    try {
      await apiClient("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      })

      safeSessionStorage.setItem(STORAGE_KEY_EMAIL, email)
      router.push(VERIFY_OTP_ROUTE)

      return { error: null, success: true }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong."
      return { error: message, success: false }
    }
  }

  const [state, action] = useActionState(forgotPasswordAction, INITIAL_STATE)

  return { state, action }
}
