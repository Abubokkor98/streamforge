import type { ChatMessageResponse } from "@/lib/types/socket-events"
import { Button } from "@/components/ui/button"
import { Trash, PushPin } from "@phosphor-icons/react"

interface ChatMessageItemProps {
  message: ChatMessageResponse & { pending?: boolean }
  isHost: boolean
  isOwnMessage: boolean
  onDelete: (messageId: number) => void
  onPin: (messageId: number, isPinned: boolean) => void
}

function ChatMessageItem({
  message,
  isHost,
  isOwnMessage,
  onDelete,
  onPin,
}: ChatMessageItemProps) {
  const isPending = !!message.pending

  return (
    <article
      className={`group flex items-start gap-2 px-4 py-1.5 transition-opacity hover:bg-white/5 ${
        isPending ? "animate-pulse opacity-50" : "opacity-100"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="wrap-break-word text-sm leading-relaxed">
          <span
            className={`mr-1.5 text-xs font-bold ${
              isOwnMessage ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {message.senderName}
          </span>
          <span className="text-foreground/90">{message.text}</span>
        </p>
      </div>

      {/* Host moderation controls — visible on hover */}
      {isHost && !isPending && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onPin(message.id, !message.isPinned)}
            className={message.isPinned ? "text-primary" : "text-muted-foreground"}
            aria-label={message.isPinned ? "Unpin message" : "Pin message"}
          >
            <PushPin className="size-3.5" weight={message.isPinned ? "fill" : "regular"} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(message.id)}
            className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
            aria-label="Delete message"
          >
            <Trash className="size-3.5" />
          </Button>
        </div>
      )}
    </article>
  )
}

export { ChatMessageItem }
