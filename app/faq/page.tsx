"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Product Questions
  {
    id: "1",
    question: "What makes KeraGold Pro products different from other hair care brands?",
    answer: "KeraGold Pro products are professional-grade formulations that combine salon-quality ingredients with advanced keratin technology. Our products are developed by cosmetic chemists and hair care experts, ensuring maximum effectiveness and safety. Unlike consumer-grade products, ours deliver salon-quality results in the comfort of your home.",
    category: "Products"
  },
  {
    id: "2",
    question: "Are your products safe for all hair types?",
    answer: "Yes, our products are formulated to be safe for all hair types including straight, wavy, curly, and coily hair. They are also safe for color-treated, chemically processed, and natural hair. All products are dermatologist tested and free from harmful chemicals like sulfates, parabens, and formaldehyde.",
    category: "Products"
  },
  {
    id: "3",
    question: "How often should I use KeraGold Pro treatments?",
    answer: "The frequency depends on the specific product and your hair's needs. Keratin treatments typically last 2-3 months with proper care. Hair repair treatments can be used weekly or as needed. Always follow the product instructions and consult with a hair care professional if you have specific concerns.",
    category: "Products"
  },
  {
    id: "4",
    question: "Can I use KeraGold Pro products if I have color-treated hair?",
    answer: "Absolutely! Our products are specifically formulated to be safe for color-treated hair. In fact, our Color Protection collection is designed to help maintain vibrant color and prevent fading. We recommend using sulfate-free products and avoiding heat styling immediately after coloring.",
    category: "Products"
  },

  // Order & Shipping
  {
    id: "5",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 2-3 business days within UAE and is free on orders over AED 200. Express shipping (next day) is available for AED 25, and same-day delivery is available for AED 50 in Dubai. Processing time is 1-2 business days for all orders.",
    category: "Shipping"
  },
  {
    id: "6",
    question: "Do you ship internationally?",
    answer: "Currently, we ship throughout the United Arab Emirates. International shipping to GCC countries is coming soon! Sign up for our newsletter to be notified when international shipping becomes available.",
    category: "Shipping"
  },
  {
    id: "7",
    question: "Can I track my order?",
    answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history. Real-time tracking is available for all shipping methods.",
    category: "Shipping"
  },
  {
    id: "8",
    question: "What if my package is damaged or lost?",
    answer: "All packages are insured. If your package arrives damaged or is lost in transit, please contact us immediately at info@keragold-uae.com or call +971 45 754 785. We'll arrange for a replacement or refund at no cost to you.",
    category: "Shipping"
  },

  // Returns & Exchanges
  {
    id: "9",
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee on all products. You can return unopened or gently used products within 30 days of delivery. We provide free return shipping labels and process refunds within 5-7 business days of receiving your return.",
    category: "Returns"
  },
  {
    id: "10",
    question: "How do I return a product?",
    answer: "Contact our customer service team at info@keragold-uae.com or call +971 45 754 785 to initiate your return. We'll email you a prepaid return shipping label and return authorization number. Package your items securely and drop off at any authorized shipping location.",
    category: "Returns"
  },
  {
    id: "11",
    question: "Can I exchange a product for a different one?",
    answer: "Yes! We offer free exchanges within 30 days. Contact us to initiate an exchange, return the original item using our free return label, and we'll ship your new item once we receive the return. You'll only pay the price difference if applicable.",
    category: "Returns"
  },

  // Account & Billing
  {
    id: "12",
    question: "How do I create an account?",
    answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, enter your email and create a password. You can also create an account during checkout. Having an account allows you to track orders, save favorites, and access exclusive offers.",
    category: "Account"
  },
  {
    id: "13",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through encrypted connections.",
    category: "Account"
  },
  {
    id: "14",
    question: "Can I change my order after placing it?",
    answer: "You can modify your order within 2 hours of placing it by contacting our customer service team. After 2 hours, you'll need to cancel the order and place a new one. We'll do our best to accommodate changes if the order hasn't been processed yet.",
    category: "Account"
  },

  // Technical Support
  {
    id: "15",
    question: "How do I contact customer support?",
    answer: "You can reach our customer support team via email at info@keragold-uae.com, phone at +971 45 754 785, or through our contact form. Our team is available Sunday-Thursday 9 AM-6 PM GST and Friday 10 AM-4 PM GST.",
    category: "Support"
  },
  {
    id: "16",
    question: "Do you offer personalized hair care advice?",
    answer: "Yes! Our customer service team includes hair care professionals who can provide personalized advice based on your hair type, concerns, and goals. Contact us with your questions and we'll help you find the perfect products for your needs.",
    category: "Support"
  },
  {
    id: "17",
    question: "What if I'm not satisfied with my purchase?",
    answer: "Your satisfaction is our priority! If you're not completely happy with your purchase, contact us within 30 days and we'll work with you to resolve the issue. This may include a refund, exchange, or store credit depending on your preference.",
    category: "Support"
  }
]

const categories = ["All", "Products", "Shipping", "Returns", "Account", "Support"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
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
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Find Answers to 
                <span className="text-amber-600"> Your Questions</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get quick answers to common questions about our products, shipping, returns, and more. 
                Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No FAQs Found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("All")
                      }}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleExpanded(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedItems.includes(faq.id) && (
                          <div className="px-6 pb-6">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Still Have Questions?
                </h2>
                <p className="text-xl text-gray-600">
                  Our customer support team is here to help you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat</h3>
                    <p className="text-gray-600 mb-6">
                      Chat with our support team in real-time for instant help
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
                    <p className="text-gray-600 mb-6">
                      Send us an email and we'll respond within 24 hours
                    </p>
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Phone className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Support</h3>
                    <p className="text-gray-600 mb-6">
                      Call us directly for immediate assistance
                    </p>
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                      Call Now
                    </Button>
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
