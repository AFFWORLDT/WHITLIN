"use client"

import { useState, memo, useCallback } from "react"
import Link from "next/link"
import { useI18n } from "@/components/language-provider"
import { ShoppingBag, Search, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useCart()
  const { user, logout } = useAuth()
  const { t } = useI18n()

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <header className="sticky top-0 z-50 bg-white text-gray-900 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 border-b border-gray-200 transition-all duration-300 shadow-sm hover:shadow-lg">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex items-center group cursor-pointer">
            <div className="transition-transform duration-300 hover:scale-105">
              <Logo size="md" showText={true} href="/" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              href="/" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-medium font-optima group py-2"
            >
              {t('nav.home', 'Home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/products" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-medium font-optima group py-2"
            >
              {t('nav.products')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/showcase" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-semibold font-optima group py-2"
            >
              {t('nav.premium')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/collections" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-medium font-optima group py-2"
            >
              {t('nav.collections')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-medium font-optima group py-2"
            >
              {t('nav.about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="relative text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 font-medium font-optima group py-2"
            >
              {t('nav.contact')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e1d7c6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Actions - Mobile Optimized */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex p-2 text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 hover:scale-110 hover:bg-[#e1d7c6]/10 rounded-full"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 hover:scale-110 hover:bg-[#e1d7c6]/10 rounded-full"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Order History</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-2 text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 hover:scale-110 hover:bg-[#e1d7c6]/10 rounded-full"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative p-2 text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 hover:scale-110 hover:bg-[#e1d7c6]/10 rounded-full group"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                {state.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-[#e1d7c6] text-foreground animate-pulse shadow-lg transition-all duration-300 group-hover:scale-125">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden p-2 text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 hover:scale-110 hover:bg-[#e1d7c6]/10 rounded-full" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in slide-in-top">
            <nav className="flex flex-col space-y-1 px-3">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home', 'Home')}
              </Link>
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                href="/showcase" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-semibold font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.premium')}
              </Link>
              <Link 
                href="/collections" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.collections')}
              </Link>
              <Link 
                href="/about" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium font-optima hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-2 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 hover:translate-x-2"
                >
                  <Search className="h-4 w-4 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  Search Products
                </Button>
              </div>
              
              {/* User Actions */}
              <div className="pt-2 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                      Welcome, {user.name}
                    </div>
                    <Link 
                      href="/account" 
                      className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link 
                      href="/orders" 
                      className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {user?.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }} 
                      className="w-full text-left text-red-600 hover:text-red-700 transition-all duration-300 py-2 px-3 rounded-md hover:bg-red-50 text-base font-medium hover:translate-x-2 hover:scale-105"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="text-gray-900 hover:text-[#e1d7c6] transition-all duration-300 py-2 px-3 rounded-md hover:bg-[#e1d7c6]/10 text-base font-medium hover:translate-x-2 hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
})


