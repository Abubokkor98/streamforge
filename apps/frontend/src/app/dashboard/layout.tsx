import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 pb-18 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
