"use client"

import { useState, memo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home,
  Package,
  Crown,
  Users,
  Info,
  Mail,
  Heart,
  Settings,
  BarChart3,
  ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar = memo(function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { state } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/showcase", label: "Premium Collections", icon: Crown },
    { href: "/collections", label: "Collections", icon: Package },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  const userItems = user ? [
    { href: "/account", label: "My Account", icon: User },
    { href: "/orders", label: "Order History", icon: ShoppingCart },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin Panel", icon: BarChart3 }] : []),
  ] : [
    { href: "/login", label: "Sign In", icon: User },
    { href: "/signup", label: "Sign Up", icon: User },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-80 lg:w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logonew.png"
                  alt="KeraGold PRO Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden lg:block">
                <span className="font-serif text-lg font-bold text-white">KeraGold</span>
                <span className="text-xs text-slate-400 block -mt-1">PRO</span>
              </div>
            </Link>
            
            {/* Mobile Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <Icon className="h-5 w-5 group-hover:text-white" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* User Section */}
              <div className="space-y-1 mt-8">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Account
                </h3>
                {userItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <Icon className="h-5 w-5 group-hover:text-white" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                
                {user && (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 group w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-700 space-y-4">
            {/* Search */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Search className="h-5 w-5 mr-3" />
              Search Products
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 relative"
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                <span>Cart</span>
                {state.itemCount > 0 && (
                  <Badge className="ml-auto h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Info */}
            {user && (
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
})
