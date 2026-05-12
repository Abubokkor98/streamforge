import type { ChatMessageResponse } from "@/lib/types/socket-events"
import { PushPin } from "@phosphor-icons/react"

interface PinnedMessageProps {
  message: ChatMessageResponse
}

function PinnedMessage({ message }: PinnedMessageProps) {
  return (
    <section className="flex items-center gap-2 border-b border-border bg-primary/10 px-4 py-2.5">
      <PushPin className="size-3.5 shrink-0 text-primary" weight="fill" />
      <p className="truncate text-xs text-foreground/80">
        <span className="mr-1.5 font-semibold text-primary">
          {message.senderName}
        </span>
        {message.text}
      </p>
    </section>
  )
}

export { PinnedMessage }
