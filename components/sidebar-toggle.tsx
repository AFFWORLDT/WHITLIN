"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

export function SidebarToggle() {
  useEffect(() => {
    // Add a global toggle function
    (window as any).toggleSidebar = () => {
      const toggleButton = document.querySelector('[title*="Open Sidebar"], [title*="Close Sidebar"]') as HTMLButtonElement
      if (toggleButton) {
        toggleButton.click()
      }
    }
  }, [])

  const toggleSidebar = () => {
    const toggleButton = document.querySelector('[title*="Open Sidebar"], [title*="Close Sidebar"]') as HTMLButtonElement
    if (toggleButton) {
      toggleButton.click()
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="bg-white shadow-lg hover:bg-gray-50 border-2 fixed top-4 right-4 z-50"
      onClick={toggleSidebar}
    >
      <PanelLeftClose className="h-5 w-5 mr-2" />
      Toggle Sidebar
    </Button>
  )
}