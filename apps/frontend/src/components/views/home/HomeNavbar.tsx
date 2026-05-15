import Link from "next/link"
import { GameController } from "@phosphor-icons/react/dist/ssr"
import { HomeNavbarActions } from "@/components/views/home/HomeNavbarActions"

function HomeNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-xl md:px-8"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary"
      >
        <span
          className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <GameController size={18} weight="fill" />
        </span>
        StreamForge
      </Link>

      <div className="flex items-center gap-3">
        <HomeNavbarActions />
      </div>
    </nav>
  )
}

export { HomeNavbar }
