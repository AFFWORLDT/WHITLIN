"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, 
  Clock, 
  Shield, 
  MapPin, 
  Package, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Truck className="w-4 h-4 mr-2" />
                Shipping Information
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Fast, Reliable 
                <span className="text-amber-600"> Shipping</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We deliver your premium hair care products quickly and safely to your doorstep. 
                Choose from multiple shipping options to fit your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Shipping Options
                </h2>
                <p className="text-xl text-gray-600">
                  Choose the shipping method that works best for you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0 mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Standard Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">FREE</div>
                      <div className="text-gray-600">On orders over $75</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">3-5 business days</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Tracking included</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Insurance included</span>
                      </li>
                    </ul>
                    <div className="text-center">
                      <Badge className="bg-blue-100 text-blue-800">
                        Most Popular
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-shadow border-2 border-amber-200">
                  <CardHeader className="p-0 mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Express Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">$12.99</div>
                      <div className="text-gray-600">1-2 business days</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Next-day delivery</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Priority tracking</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Signature required</span>
                      </li>
                    </ul>
                    <div className="text-center">
                      <Badge className="bg-amber-100 text-amber-800">
                        Fastest Option
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0 mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Overnight Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">$24.99</div>
                      <div className="text-gray-600">Next business day</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Guaranteed delivery</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Real-time tracking</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">White-glove service</span>
                      </li>
                    </ul>
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        Premium Service
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Details */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    Shipping Details
                  </h2>
                  
                  <div className="space-y-8">
                    <Card className="p-6">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              Delivery Areas
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              We currently ship to all 50 US states and Canada. International shipping 
                              is coming soon! Free shipping is available on orders over $75 within the US.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              Processing Time
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              Orders are processed within 1-2 business days. Orders placed after 2 PM EST 
                              will be processed the next business day. Weekend orders are processed on Monday.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              Package Protection
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              All packages are carefully wrapped and protected. We use eco-friendly 
                              packaging materials and include insurance on all shipments for your peace of mind.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    Important Information
                  </h2>

                  <div className="space-y-6">
                    <Card className="p-6 bg-blue-50 border-blue-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">
                              Signature Required
                            </h3>
                            <p className="text-blue-800">
                              Express and overnight shipments require a signature upon delivery. 
                              If you're not available, the carrier will leave a notice with instructions.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-amber-50 border-amber-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold text-amber-900 mb-2">
                              Weather Delays
                            </h3>
                            <p className="text-amber-800">
                              Severe weather conditions may cause delivery delays. We'll notify you 
                              if your shipment is affected and provide updated delivery estimates.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-green-50 border-green-200">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold text-green-900 mb-2">
                              Tracking Information
                            </h3>
                            <p className="text-green-800">
                              You'll receive tracking information via email once your order ships. 
                              Track your package in real-time through our website or carrier's app.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping FAQ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Shipping FAQ
                </h2>
                <p className="text-xl text-gray-600">
                  Common questions about our shipping policies
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      How do I track my order?
                    </h3>
                    <p className="text-gray-600">
                      Once your order ships, you'll receive a tracking number via email. You can also 
                      track your order by logging into your account and viewing your order history.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Can I change my shipping address after placing an order?
                    </h3>
                    <p className="text-gray-600">
                      You can change your shipping address within 2 hours of placing your order. 
                      After that, please contact our customer service team for assistance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      What if my package is damaged or lost?
                    </h3>
                    <p className="text-gray-600">
                      All packages are insured. If your package arrives damaged or is lost in transit, 
                      please contact us immediately and we'll arrange for a replacement or refund.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Do you ship to PO boxes?
                    </h3>
                    <p className="text-gray-600">
                      Yes, we ship to PO boxes for standard shipping. Express and overnight shipping 
                      options require a physical address for delivery.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Can I schedule a specific delivery time?
                    </h3>
                    <p className="text-gray-600">
                      For express and overnight shipments, you can request a specific delivery window 
                      through the carrier's website using your tracking number.
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
