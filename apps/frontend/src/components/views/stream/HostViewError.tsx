import { Button } from "@/components/ui/button"
import Link from "next/link"

function HostViewError({ message }: { message: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold text-destructive">
        Broadcast Error
      </h1>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {message}
      </p>
      <Button variant="outline" asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </main>
  )
}

export { HostViewError }
