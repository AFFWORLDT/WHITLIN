"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <MessageCircle className="w-4 h-4 mr-2" />
                Get in Touch
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                We'd Love to 
                <span className="text-amber-600"> Hear from You</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Have questions about our products? Need help with your order? 
                Our customer support team is here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
                    <p className="text-gray-600 mb-4">
                      Send us an email and we'll respond within 24 hours
                    </p>
                    <a 
                      href="mailto:info@keragold-uae.com" 
                      className="text-amber-600 font-medium hover:text-amber-700"
                    >
                      info@keragold-uae.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Phone className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
                    <p className="text-gray-600 mb-4">
                      Speak directly with our customer support team
                    </p>
                    <a 
                      href="tel:+97145754785" 
                      className="text-amber-600 font-medium hover:text-amber-700"
                    >
                      +971 45 754 785
                    </a>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit Us</h3>
                    <p className="text-gray-600 mb-4">
                      Our headquarters and customer service center
                    </p>
                    <address className="text-amber-600 font-medium not-italic">
                      Aspin Tower<br />
                      Sheikh Zayed Road<br />
                      Dubai, United Arab Emirates
                    </address>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="p-8">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      Send us a Message
                    </CardTitle>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us how we can help you..."
                          rows={6}
                          className="w-full"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information & Hours */}
                <div className="space-y-8">
                  <Card className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-amber-600" />
                        Business Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Sunday - Thursday</span>
                          <span className="text-gray-600">9:00 AM - 6:00 PM GST</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Friday</span>
                          <span className="text-gray-600">10:00 AM - 4:00 PM GST</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium text-gray-700">Saturday</span>
                          <span className="text-gray-600">Closed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Follow Us
                      </CardTitle>
                      <p className="text-gray-600">
                        Stay connected and get the latest updates
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex space-x-4">
                        <a 
                          href="https://instagram.com/keragoldpro" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://facebook.com/keragoldpro" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Facebook className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://twitter.com/keragoldpro" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Twitter className="w-6 h-6" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Need Immediate Help?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        For urgent inquiries or order issues, please call our customer service line.
                      </p>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now: +971 45 754 785
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-100 text-amber-800">
                  Quick Answers
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600">
                  Find quick answers to common questions
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      How long does shipping take?
                    </h3>
                    <p className="text-gray-600">
                      Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      What's your return policy?
                    </h3>
                    <p className="text-gray-600">
                      We offer a 30-day money-back guarantee on all products. Returns are free and easy.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Are your products safe for all hair types?
                    </h3>
                    <p className="text-gray-600">
                      Yes, our products are formulated to be safe for all hair types and are dermatologist tested.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Do you offer international shipping?
                    </h3>
                    <p className="text-gray-600">
                      Currently we ship within the US and Canada. International shipping coming soon!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
