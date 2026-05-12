"use client"

import { useCreateRoomAction } from "@/hooks/useCreateRoomAction"
import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

const DESCRIPTION_MAX_LENGTH = 500

function CreateRoomForm() {
  const { state, action } = useCreateRoomAction()

  return (
    <form action={action} className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create a new room</CardTitle>
          <CardDescription>
            Set up your streaming room. You can edit settings later.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormAlert message={state.error} />

          <FormField
            id="create-room-title"
            name="title"
            label="Room Title"
            placeholder="My awesome stream"
            required
            error={state.fieldErrors.title}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-room-description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="create-room-description"
              name="description"
              placeholder="What's this stream about?"
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={3}
              aria-invalid={!!state.fieldErrors.description}
              aria-describedby={
                state.fieldErrors.description
                  ? "create-room-description-error"
                  : undefined
              }
            />
            {state.fieldErrors.description && (
              <p
                id="create-room-description-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {state.fieldErrors.description}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton size="lg" className="w-full" pendingText="Creating…">
            Create Room
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  )
}

export { CreateRoomForm }
