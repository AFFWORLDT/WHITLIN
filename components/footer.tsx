"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logonew.png"
                  alt="KeraGold PRO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold">KeraGold</span>
                <span className="text-xs text-gray-400 block -mt-1">PRO</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-pretty">
              Professional hair care solutions for the modern woman. Transform your hair with luxury treatments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-primary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates on new products and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isSubscribing}
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-black"
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
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
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
