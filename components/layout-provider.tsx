"use client"

import { useState, createContext, useContext, ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface LayoutContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-background border-b border-border">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="text-foreground hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">KeraGold PRO</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-2 py-1">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
