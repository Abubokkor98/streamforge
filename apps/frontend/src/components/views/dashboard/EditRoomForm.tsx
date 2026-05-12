"use client"

import { useEditRoomAction } from "@/hooks/useEditRoomAction"
import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import type { Room } from "@/lib/types/room"

interface EditRoomFormProps {
  room: Room
}

const DESCRIPTION_MAX_LENGTH = 500
const SLOW_MODE_MAX = 60

function EditRoomForm({ room }: EditRoomFormProps) {
  const { state, action } = useEditRoomAction(room.roomKey)

  return (
    <form action={action} className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit room</CardTitle>
          <CardDescription>
            Update your room settings. Changes take effect immediately.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormAlert message={state.error} />

          <FormField
            id="edit-room-title"
            name="title"
            label="Room Title"
            placeholder="My awesome stream"
            defaultValue={room.title}
            required
            error={state.fieldErrors.title}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-room-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="edit-room-description"
              name="description"
              placeholder="What's this stream about?"
              defaultValue={room.description ?? ""}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={3}
              aria-invalid={!!state.fieldErrors.description}
              aria-describedby={
                state.fieldErrors.description
                  ? "edit-room-description-error"
                  : undefined
              }
            />
            {state.fieldErrors.description && (
              <p
                id="edit-room-description-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {state.fieldErrors.description}
              </p>
            )}
          </div>

          <FormField
            id="edit-room-slow-mode"
            name="slowModeInterval"
            type="number"
            label="Slow Mode (seconds)"
            placeholder="Off"
            defaultValue={room.slowModeInterval ?? ""}
            min={1}
            max={SLOW_MODE_MAX}
            error={state.fieldErrors.slowModeInterval}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="edit-room-guest-chat">Guest Chat</Label>
              <p className="text-xs text-muted-foreground">
                Allow non-logged-in viewers to send messages
              </p>
            </div>
            <Switch
              id="edit-room-guest-chat"
              name="guestChatEnabled"
              defaultChecked={room.guestChatEnabled}
            />
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton size="lg" className="w-full" pendingText="Saving…">
            Save Changes
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  )
}

export { EditRoomForm }
