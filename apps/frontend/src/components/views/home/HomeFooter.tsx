import Link from "next/link"
import { GameController, GithubLogo } from "@phosphor-icons/react/dist/ssr"

const CURRENT_YEAR = new Date().getFullYear()

async function HomeFooter() {
  return (
    <footer className="border-t border-border/40 px-6 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        {/* Brand */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <GameController size={14} weight="fill" />
          </span>
          <span className="font-semibold text-foreground">StreamForge</span>
          <span className="mx-1">·</span>
          <span>&copy; {CURRENT_YEAR}</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Link href="/register" className="transition-colors hover:text-foreground">
            Get Started
          </Link>
          <a
            href="https://github.comhttps://github.com/Abubokkor98/streamforge"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <GithubLogo size={18} weight="bold" />
          </a>
        </nav>
      </div>
    </footer>
  )
}

export { HomeFooter }
