"use client"

import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { useAuth } from "@/lib/auth-context"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar user={user} logout={logout} />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
