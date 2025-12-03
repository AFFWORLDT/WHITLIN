"use client"

import React from "react"
import { useState } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          source: 'contact-form',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-amber-50 to-orange-50 py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
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
                Have questions about our hospitality linen products? Need help with your order? 
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
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow hover-lift">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
                      <p className="text-gray-600 mb-4">
                        Send us an email and we'll respond within 24 hours
                      </p>
                      <a 
                        href="mailto:info@whitlin.com" 
                        className="text-amber-600 font-medium hover:text-amber-700"
                      >
                        info@whitlin.com
                      </a>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
                      <p className="text-gray-600 mb-4">
                        Speak directly with our customer support team
                      </p>
                      <div className="space-y-1">
                        <a 
                          href="tel:+971544389849" 
                          className="block text-amber-600 font-medium hover:text-amber-700"
                        >
                          +971 54 438 9849
                        </a>
                        <a 
                          href="tel:+971503961541" 
                          className="block text-amber-600 font-medium hover:text-amber-700"
                        >
                          +971 50 396 1541
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
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
                        WHITLIN (1st Floor)<br />
                        231 Al Ittihad Rd<br />
                        Al Qusais, Al Nahda 1<br />
                        Dubai, United Arab Emirates
                      </address>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Factory:</p>
                        <address className="text-amber-600 font-medium not-italic text-sm">
                          3044, N.H.B.C Panipat 132103<br />
                          Harayana, India
                        </address>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <ScrollAnimate animation="slide-in-left" delay={0.1}>
                  <Card className="p-8 hover-lift">
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
                </ScrollAnimate>

                {/* Contact Information & Hours */}
                <ScrollAnimate animation="slide-in-right" delay={0.2}>
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
                          href="https://instagram.com/whitlin" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://facebook.com/whitlin" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                        >
                          <Facebook className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://twitter.com/whitlin" 
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
                </ScrollAnimate>
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
                <ScrollAnimate animation="fade-in-up" delay={0.1}>
                  <Card className="p-6 hover-lift">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Branding is simply a more efficient way to sell things?
                      </h3>
                      <p className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam eu lorem nibh. Mauris ex dolor, rutrum in odio vel, suscipit ultrices nunc. Cras ipsum dolor, eleifend et nisl vel, tempor molestie nibh. In hac habitasse platea dictumst. Proin nec blandit ligula.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.2}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        It's better to be first in the mind than to be first in the marketplace?
                      </h3>
                      <p className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacini.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.3}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Marketing is a company's ultimate objective?
                      </h3>
                      <p className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam eu lorem nibh. Mauris ex dolor, rutrum in odio vel, suscipit ultrices nunc. Cras ipsum dolor, eleifend et nisl vel, tempor molestie nibh. In hac habitasse platea dictumst. Proin nec blandit ligula.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.4}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Positioning is what you do to the mind of the prospect?
                      </h3>
                      <p className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
