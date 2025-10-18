"use client"

import { useState } from "react"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar user={user} logout={logout} />
      
      {/* Prominent Close/Open Button */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 border-2"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <>
              <PanelLeftOpen className="h-5 w-5 mr-2" />
              Open Sidebar
            </>
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5 mr-2" />
              Close Sidebar
            </>
          )}
        </Button>
      </div>

      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}