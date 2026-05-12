"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  variant?: "sidebar" | "mobile"
}

const SIDEBAR_STYLES = {
  active: "bg-sidebar-accent text-sidebar-primary",
  inactive:
    "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
  base: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
} as const

const MOBILE_STYLES = {
  active: "text-sidebar-primary",
  inactive: "text-muted-foreground hover:text-sidebar-foreground",
  base: "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors",
} as const

/**
 * Client-only leaf component — reads pathname for active state.
 * Used by both Sidebar and MobileNav (server components).
 */
function NavLink({ href, label, icon, variant = "sidebar" }: NavLinkProps) {
  const pathname = usePathname()

  const isActive =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href))

  const styles = variant === "mobile" ? MOBILE_STYLES : SIDEBAR_STYLES

  return (
    <Link
      href={href}
      className={`${styles.base} ${isActive ? styles.active : styles.inactive}`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      {label}
    </Link>
  )
}

export { NavLink }
