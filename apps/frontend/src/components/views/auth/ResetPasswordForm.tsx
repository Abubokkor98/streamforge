import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface ResetPasswordFormProps {
  action: (formData: FormData) => void
  error: string | null
  fieldErrors: {
    newPassword?: string
    confirmPassword?: string
  }
}

function ResetPasswordForm({
  action,
  error,
  fieldErrors,
}: ResetPasswordFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormAlert message={error} />

      <FormField
        id="reset-new-password"
        name="newPassword"
        type="password"
        label="New Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.newPassword}
        required
      />

      <FormField
        id="reset-confirm-password"
        name="confirmPassword"
        type="password"
        label="Confirm New Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        required
      />

      <SubmitButton size="lg" pendingText="Resetting…">
        Reset Password
      </SubmitButton>
    </form>
  )
}

export { ResetPasswordForm }
