import Link from "next/link"
import { LogoutButton } from "@/components/shared/logout-button"

function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 lg:px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-bold tracking-tight text-sidebar-foreground transition-colors hover:text-sidebar-primary"
      >
        <span
          className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground"
          aria-hidden="true"
        >
          SF
        </span>
        StreamForge
      </Link>

      <LogoutButton />
    </header>
  )
}

export { Navbar }
