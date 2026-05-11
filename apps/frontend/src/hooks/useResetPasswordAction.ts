"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { validatePassword, validatePasswordMatch } from "@/lib/validation"

interface ResetPasswordState {
  error: string | null
  fieldErrors: {
    newPassword?: string
    confirmPassword?: string
  }
}

const INITIAL_STATE: ResetPasswordState = { error: null, fieldErrors: {} }
const LOGIN_ROUTE = "/login"

export function useResetPasswordAction() {
  const router = useRouter()

  async function resetPasswordAction(
    _prevState: ResetPasswordState,
    formData: FormData,
  ): Promise<ResetPasswordState> {
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const resetToken = sessionStorage.getItem("reset-token")

    if (!resetToken) {
      return {
        error: "Session expired. Please restart the password reset.",
        fieldErrors: {},
      }
    }

    const fieldErrors: ResetPasswordState["fieldErrors"] = {}

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      fieldErrors.newPassword = passwordError
    }

    const matchError = validatePasswordMatch(newPassword, confirmPassword)
    if (matchError) {
      fieldErrors.confirmPassword = matchError
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors }
    }

    try {
      await apiClient("/api/auth/reset-password", {
        method: "POST",
        body: { resetToken, newPassword },
      })

      sessionStorage.removeItem("reset-token")
      toast.success("Password reset successfully. Please sign in.")
      router.push(LOGIN_ROUTE)

      return INITIAL_STATE
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Reset failed."
      return { error: message, fieldErrors: {} }
    }
  }

  const [state, action] = useActionState(resetPasswordAction, INITIAL_STATE)

  return { state, action }
}
