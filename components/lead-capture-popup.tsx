"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, Building2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface LeadCapturePopupProps {
  onClose: () => void
}

export function LeadCapturePopup({ onClose }: LeadCapturePopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          subject: 'Inquiry from Popup',
          source: 'popup',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Thank you! We'll contact you soon.")
        onClose()
        // Don't show popup again for this session
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('leadPopupShown', 'true')
        }
      } else {
        throw new Error(data.error || 'Failed to submit')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-bounce-in-subtle hover-shadow-premium">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 smooth-color-transition hover-scale-smooth button-press z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Exclusive Offers!
            </h2>
            <p className="text-gray-600">
              Subscribe to receive special discounts and updates on our premium hospitality linen products.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone (Optional)"
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company (Optional)"
                className="w-full"
              />
            </div>
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your requirements (Optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By submitting, you agree to receive marketing communications from Whitlin.
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook to show popup after delay
export function useLeadPopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('leadPopupShown')) {
      return
    }

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  return { showPopup, setShowPopup }
}

