"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

interface VerifyOtpState {
  error: string | null
}

interface VerifyOtpResponse {
  resetToken: string
}

const INITIAL_STATE: VerifyOtpState = { error: null }
const RESET_PASSWORD_ROUTE = "/reset-password"

export function useVerifyOtpAction() {
  const router = useRouter()

  async function verifyOtpAction(
    _prevState: VerifyOtpState,
    formData: FormData,
  ): Promise<VerifyOtpState> {
    const otp = formData.get("otp") as string
    const email = sessionStorage.getItem("reset-email")

    if (!email) {
      return { error: "Session expired. Please restart the password reset." }
    }

    if (!otp?.trim()) {
      return { error: "OTP code is required." }
    }

    try {
      const data = await apiClient<VerifyOtpResponse>(
        "/api/auth/verify-otp",
        {
          method: "POST",
          body: { email, otp },
        },
      )

      // Store reset token for the final step
      sessionStorage.setItem("reset-token", data.resetToken)
      sessionStorage.removeItem("reset-email")
      router.push(RESET_PASSWORD_ROUTE)

      return { error: null }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid OTP."
      return { error: message }
    }
  }

  const [state, action] = useActionState(verifyOtpAction, INITIAL_STATE)

  return { state, action }
}
