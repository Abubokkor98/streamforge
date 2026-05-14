"use client"

import { useActionState } from "react"
import { SubmitButton } from "@/components/shared/submit-button"
import { PaperPlaneTilt } from "@phosphor-icons/react"

const MAX_MESSAGE_LENGTH = 300

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  slowModeRemaining?: number | null
}

function ChatInput({ onSend, disabled, slowModeRemaining }: ChatInputProps) {
  const [, action, isPending] = useActionState(async (_: null, formData: FormData) => {
    const text = formData.get("text") as string
    if (text?.trim()) {
      onSend(text.trim())
    }
    return null
  }, null)

  const isSlowMode =
    slowModeRemaining !== null &&
    slowModeRemaining !== undefined &&
    slowModeRemaining > 0
  
  const isDisabled = disabled || isSlowMode || isPending

  const placeholderText = isSlowMode
    ? `Slow mode: ${slowModeRemaining}s`
    : "Send a message…"

  return (
    <form
      action={action}
      className="flex items-center gap-2 border-t border-border px-3 py-2.5"
    >
      <input
        name="text"
        type="text"
        autoComplete="off"
        placeholder={placeholderText}
        maxLength={MAX_MESSAGE_LENGTH}
        disabled={isDisabled}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Chat message input"
      />
      <SubmitButton
        size="icon-sm"
        disabled={isDisabled}
        aria-label="Send message"
      >
        <PaperPlaneTilt className="size-4" weight="fill" />
      </SubmitButton>
    </form>
  )
}

export { ChatInput }
