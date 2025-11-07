"use client"

import { useState } from "react"
import { useI18n } from "@/components/language-provider"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter, Mail, Loader2 } from "lucide-react"
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
    <footer className="bg-black text-white">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                <Image
                  src="/images/logonew.png"
                  alt="KeraGold PRO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold">KeraGold</span>
                <span className="text-xs text-gray-400 block -mt-1">PRO</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm text-pretty">
              Professional hair care solutions for the modern woman. Transform your hair with luxury treatments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
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
                <Link href="/shipping" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary transition-colors text-sm sm:text-base">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.contactUs')}</h3>
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
                className="bg-primary hover:bg-primary/90 text-black w-full sm:w-auto"
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
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm px-2">
            © 2025 KeraGold Pro. All rights reserved. |
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
