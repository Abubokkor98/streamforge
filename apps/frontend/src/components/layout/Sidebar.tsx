import { SquaresFour, List, ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr"
import { NavLink } from "@/components/shared/nav-link"

interface NavItemConfig {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: <SquaresFour className="size-4 shrink-0" aria-hidden="true" /> },
  { label: "My Rooms", href: "/dashboard/rooms", icon: <List className="size-4 shrink-0" aria-hidden="true" /> },
  { label: "Stream History", href: "/dashboard/history", icon: <ClockCounterClockwise className="size-4 shrink-0" aria-hidden="true" /> },
]

function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <nav aria-label="Dashboard navigation" className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
    </aside>
  )
}

export { Sidebar }
