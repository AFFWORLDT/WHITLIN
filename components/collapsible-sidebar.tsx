"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Package, 
  Crown, 
  Box, 
  Info, 
  Mail, 
  User, 
  Users, 
  Search, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user?: any
  logout?: () => void
}

export function CollapsibleSidebar({ user, logout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/showcase", label: "Premium Collections", icon: Crown },
    { href: "/collections", label: "Collections", icon: Box },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/logonew.png"
                    alt="KeraGold PRO Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold">KeraGold</span>
                  <span className="text-xs text-slate-400 block -mt-1">PRO</span>
                </div>
              </Link>
            )}
            
            {/* Collapse Button - Desktop Only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-slate-700"
              onClick={toggleSidebar}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Close Button - Mobile Only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-slate-700"
              onClick={toggleMobileSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              <h3 className={cn(
                "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3",
                isCollapsed && "hidden"
              )}>
                Navigation
              </h3>
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Account Section */}
            <div className="space-y-1 pt-4 border-t border-slate-700">
              <h3 className={cn(
                "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3",
                isCollapsed && "hidden"
              )}>
                Account
              </h3>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">My Account</span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      logout?.()
                      setIsMobileOpen(false)
                    }}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors w-full",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <X className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">Sign Out</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">Sign In</span>
                    )}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Users className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">Sign Up</span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            {/* Search */}
            <div className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800",
              isCollapsed && "justify-center px-2"
            )}>
              <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
              {!isCollapsed && (
                <input
                  type="text"
                  placeholder="Search Products"
                  className="bg-transparent text-sm text-slate-300 placeholder-slate-500 focus:outline-none w-full"
                />
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Cart</span>
              )}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "md:ml-16" : "md:ml-64"
      )} />
    </>
  )
}
