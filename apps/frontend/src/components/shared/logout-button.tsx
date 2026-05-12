"use client"

import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { SignOut } from "@phosphor-icons/react"
import { toast } from "sonner"

const LOGOUT_ENDPOINT = "/api/auth/logout"
const LOGIN_ROUTE = "/login"

/**
 * Client leaf — handles logout with useRouter + onClick.
 * Clears token client-side even if server call fails (graceful degradation).
 */
function LogoutButton() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    try {
      await axiosInstance.post(LOGOUT_ENDPOINT)
    } catch {
      // Server-side cleanup failed — still proceed with client-side logout
    } finally {
      logout()
      router.push(LOGIN_ROUTE)
      toast.success("Signed out successfully.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-2 text-muted-foreground hover:text-destructive"
    >
      <SignOut className="size-4" aria-hidden="true" />
      Sign out
    </Button>
  )
}

export { LogoutButton }
