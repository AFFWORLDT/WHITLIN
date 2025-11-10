"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Menu,
  X,
  LogOut,
  User,
  Tags
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tags, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
  // Hidden menu items: Newsletter, Analytics, Settings
  // { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
  // { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  // { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
      // If user is not logged in or not admin, redirect to login
      if (!user || user.role !== "admin") {
        router.push("/login?redirect=/admin")
      }
    }
  }, [user, authLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Show loading while checking authentication
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is admin
  const isAdmin = user?.role === "admin"

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/login")} className="w-full">
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`} style={{ marginLeft: 0, paddingLeft: 0 }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="relative w-14 h-14">
                <Image
                  src="/images/logonew.png"
                  alt="KeraGold PRO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg font-bold">KeraGold Admin</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2 flex flex-col">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-1">
        {/* Top bar */}
        <header className="bg-card border-b border-border py-3">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-base sm:text-lg font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
