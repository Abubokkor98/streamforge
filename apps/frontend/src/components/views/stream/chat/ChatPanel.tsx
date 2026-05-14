"use client"

import { useRef, useEffect } from "react"
import { useChat } from "@/hooks/useChat"
import { useAuthStore } from "@/lib/auth-store"
import { ChatMessageItem } from "@/components/views/stream/chat/ChatMessageItem"
import { ChatInput } from "@/components/views/stream/chat/ChatInput"
import { PinnedMessage } from "@/components/views/stream/chat/PinnedMessage"
import { ChatGuestBlock } from "@/components/views/stream/chat/ChatGuestBlock"
import { ChatText } from "@phosphor-icons/react"

interface ChatPanelProps {
  roomKey: string
  isHost: boolean
  guestChatEnabled: boolean
}

function ChatPanel({ roomKey, isHost, guestChatEnabled }: ChatPanelProps) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = !!user
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, pinnedMessage, sendMessage, deleteMessage, pinMessage } =
    useChat({ roomKey, isHost })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const canChat = isAuthenticated || guestChatEnabled
  const showGuestBlock = !isAuthenticated && !guestChatEnabled

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-2xl">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <ChatText className="size-4 text-muted-foreground" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Live Chat
        </h2>
      </header>

      {/* Pinned message */}
      {pinnedMessage && <PinnedMessage message={pinnedMessage} />}

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth py-2"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-muted-foreground">
              No messages yet — say something!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isHost={isHost}
              isOwnMessage={user !== null && msg.senderId === user.id}
              onDelete={deleteMessage}
              onPin={pinMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {showGuestBlock ? (
        <ChatGuestBlock />
      ) : canChat ? (
        <ChatInput onSend={sendMessage} />
      ) : null}
    </aside>
  )
}

export { ChatPanel }
