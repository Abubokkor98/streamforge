import Link from "next/link"
import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface LoginFormProps {
  action: (formData: FormData) => void
  error: string | null
}

function LoginForm({ action, error }: LoginFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <FormAlert message={error} />

      <FormField
        id="login-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FormField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        <Link
          href="/forgot-password"
          className="self-end text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton size="lg" pendingText="Signing in…">
        Sign In
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}

export { LoginForm }
