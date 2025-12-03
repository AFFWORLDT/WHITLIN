"use client"

import { useState } from "react"
import { useI18n } from "@/components/language-provider"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Instagram, Facebook, Twitter, Mail, Loader2, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { t } = useI18n()

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    setIsSubscribing(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'website'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Successfully subscribed to our newsletter!")
        setEmail("")
      } else {
        toast.error(data.error || "Failed to subscribe to newsletter")
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <Logo size="lg" href="/" />
            <p className="text-gray-400 text-xs sm:text-sm text-pretty">
              Trusted Linen Excellence Since 1984. Discover premium-quality linen crafted with care and expertise. 
              From luxurious duvets, bed sheets, and duvet covers to plush towels and more — Whitlin has been delivering 
              comfort, style, and durability for over four decades around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.customerCare')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.contactUs')}</h3>
            <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-400">
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>WHITLIN (1st Floor), 231 Al Ittihad Rd, Al Qusais, Al Nahda 1, Dubai, UAE</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="tel:+971544389849" className="hover:text-primary transition-colors">+971 54 438 9849</a>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="tel:+971503961541" className="hover:text-primary transition-colors">+971 50 396 1541</a>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="mailto:info@whitlin.com" className="hover:text-primary transition-colors">info@whitlin.com</a>
              </p>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Get the latest updates on new products and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base flex-1"
                disabled={isSubscribing}
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-black w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </form>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 hover:scale-110 hover:bg-primary/10 rounded-full">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 hover:scale-110 hover:bg-primary/10 rounded-full">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 hover:scale-110 hover:bg-primary/10 rounded-full">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm px-2">
            © 2025 Whitlin. All rights reserved. |
            <Link href="/privacy" className="hover:text-primary transition-colors ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="hover:text-primary transition-colors ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
