"use client"

import { useState, memo, useCallback } from "react"
import Link from "next/link"
import { useI18n } from "@/components/language-provider"
import Image from "next/image"
import { ShoppingBag, Search, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo - Mobile Optimized */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/images/logonew.png"
                alt="KeraGold PRO Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden xs:block">
              <span className="font-serif text-lg sm:text-xl font-bold">KeraGold</span>
              <span className="text-xs text-muted-foreground block -mt-1">PRO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              {t('nav.products')}
            </Link>
            <Link href="/showcase" className="text-foreground hover:text-primary transition-colors font-semibold">
              {t('nav.premium')}
            </Link>
            <Link href="/collections" className="text-foreground hover:text-primary transition-colors">
              {t('nav.collections')}
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right Actions - Mobile Optimized */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex p-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-2">
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
                <Button variant="ghost" size="icon" className="p-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative p-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden p-2" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-3 px-3">
              <Link 
                href="/products" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                href="/showcase" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.premium')}
              </Link>
              <Link 
                href="/collections" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.collections')}
              </Link>
              <Link 
                href="/dashboard" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/about" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/contact" 
                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-2 border-t border-border">
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary py-2 px-3">
                  <Search className="h-4 w-4 mr-3" />
                  Search Products
                </Button>
              </div>
              
              {/* User Actions */}
              <div className="pt-2 border-t border-border">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Welcome, {user.name}
                    </div>
                    <Link 
                      href="/account" 
                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    {user?.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
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
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors py-2 px-3 rounded-md hover:bg-red-50 text-base font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"
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

              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}

            </Button>

          </div>

        </div>



        {/* Mobile Navigation - Enhanced */}

        {isMenuOpen && (

          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur">

            <nav className="flex flex-col space-y-3 px-3">

              <Link 

                href="/products" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                onClick={() => setIsMenuOpen(false)}

              >

                Products

              </Link>

              <Link 

                href="/showcase" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium font-semibold"

                onClick={() => setIsMenuOpen(false)}

              >

                Premium Collections

              </Link>

              <Link 

                href="/collections" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                onClick={() => setIsMenuOpen(false)}

              >

                Collections

              </Link>

              <Link 

                href="/dashboard" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                onClick={() => setIsMenuOpen(false)}

              >

                Dashboard

              </Link>

              <Link 

                href="/about" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                onClick={() => setIsMenuOpen(false)}

              >

                About

              </Link>

              <Link 

                href="/contact" 

                className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                onClick={() => setIsMenuOpen(false)}

              >

                Contact

              </Link>

              

              {/* Mobile Search */}

              <div className="pt-2 border-t border-border">

                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary py-2 px-3">

                  <Search className="h-4 w-4 mr-3" />

                  Search Products

                </Button>

              </div>

              

              {/* User Actions */}

              <div className="pt-2 border-t border-border">

                {user ? (

                  <>

                    <div className="px-3 py-2 text-sm text-muted-foreground">

                      Welcome, {user.name}

                    </div>

                    <Link 

                      href="/account" 

                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                      onClick={() => setIsMenuOpen(false)}

                    >

                      My Account

                    </Link>

                    {user?.role === "admin" && (

                      <Link 

                        href="/admin" 

                        className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

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

                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors py-2 px-3 rounded-md hover:bg-red-50 text-base font-medium"

                    >

                      Sign Out

                    </button>

                  </>

                ) : (

                  <>

                    <Link 

                      href="/login" 

                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

                      onClick={() => setIsMenuOpen(false)}

                    >

                      Sign In

                    </Link>

                    <Link 

                      href="/signup" 

                      className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted/50 text-base font-medium"

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


