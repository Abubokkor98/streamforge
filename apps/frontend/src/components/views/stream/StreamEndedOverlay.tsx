import { Button } from "@/components/ui/button"
import Link from "next/link"

function StreamEndedOverlay({ roomTitle }: { roomTitle: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-muted p-4">
        <span className="text-3xl" role="img" aria-label="Stream ended">
          📺
        </span>
      </div>
      <h1 className="text-lg font-semibold text-foreground">Stream Ended</h1>
      <p className="text-sm text-muted-foreground">
        &ldquo;{roomTitle}&rdquo; has finished broadcasting.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </main>
  )
}

export { StreamEndedOverlay }
