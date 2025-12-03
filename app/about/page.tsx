"use client"

import React from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  Heart, 
  Award, 
  Users, 
  Target, 
  Star, 
  Shield, 
  Leaf, 
  Sparkles,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-amber-50 to-orange-50 py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Heart className="w-4 h-4 mr-2" />
                About Whitlin
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Trusted Linen Excellence 
                <span className="text-amber-600"> Since 1984</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover premium-quality linen crafted with care and expertise. From luxurious duvets, bed sheets, and duvet covers 
                to plush towels and more — Whitlin has been delivering comfort, style, and durability for over four decades around the globe. 
                We proudly serve both B2B and B2C markets, partnering with leading hotels, corporate clients, and individual customers across the region.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">100% Organic Cotton</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Leaf className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Hospitality Grade</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollAnimate animation="fade-in-up" delay={0.1}>
                  <div>
                    <Badge className="mb-4 bg-amber-100 text-amber-800">
                      Our Story
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                      Excellence in Hospitality Linen
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Over the years, we have also had the privilege of partnering with globally recognized brands such as Taj, Marriott, 
                      Hilton, Radisson, Renest, Clarks, Himalayan Heights, Haryana Tourism, Tollygunge Club, Amar Hotel, Hotel Parmeshwari, 
                      Jehan Numa, Utopia Safdarjung Club, Aga Heritage Club, Palm Bliss, and several more notable organizations.
                    </p>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      In line with our commitment to growth and global outreach, we have recently expanded operations to the UAE under the name 
                      WHITLIN LLP, providing warehousing and distribution services. Experience the Whitlin standard — where quality meets elegance.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">40+ Years Experience (Since 1984)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">7,000+ Clients Worldwide</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Global Distribution Network</span>
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
                <ScrollAnimate animation="fade-in-up" delay={0.2}>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8">
                      <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Award Winning</h3>
                            <p className="text-sm text-gray-600">Premium Hospitality Linen</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">7,000+</h3>
                            <p className="text-sm text-gray-600">Clients Worldwide</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <Star className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">4.9/5</h3>
                            <p className="text-sm text-gray-600">Customer Rating</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">100%</h3>
                            <p className="text-sm text-gray-600">Satisfaction Guarantee</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-amber-100 text-amber-800">
                    Our Mission
                  </Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Why Whitlin?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our commitment to excellence drives everything we do, from our vision to our core values.
                  </p>
                </div>
              </ScrollAnimate>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To be the world's most trusted and innovative linen brand, setting the benchmark for luxury, 
                        sustainability, and reliability in every space we touch — from five-star hotels to modern homes 
                        while enriching lives with comfort, elegance, and timeless quality.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Target className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To deliver premium sustainable linen that blends luxury and durability serving hospitality 
                        and homes with comfort, elegance and trust.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Heart className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Values</h3>
                      <div className="text-gray-600 leading-relaxed text-left space-y-2">
                        <p><strong>Quality</strong> – Uncompromising excellence in product.</p>
                        <p><strong>Sustainability</strong> – Eco-friendly and responsible sourcing.</p>
                        <p><strong>Integrity</strong> – Trust and reliability in all relationships.</p>
                        <p><strong>Innovation</strong> – Modern solutions for evolving needs.</p>
                        <p><strong>Customer Focus</strong> – Comfort and satisfaction above all.</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-amber-100 text-amber-800">
                    Meet Our Team
                  </Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Team Behind the Scenes
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Meet the leadership team driving Whitlin's success and innovation in the hospitality linen industry.
                  </p>
                </div>
              </ScrollAnimate>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Users className="w-16 h-16 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Jitender Kumar Singla</h3>
                      <p className="text-amber-600 font-semibold mb-4 text-lg">Chairman</p>
                      <p className="text-gray-600 leading-relaxed">
                        Leading Whitlin with strategic vision and decades of industry expertise, 
                        ensuring our commitment to excellence and innovation.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Award className="w-16 h-16 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Vijay Kumar Saini</h3>
                      <p className="text-amber-600 font-semibold mb-4 text-lg">Chief Executive Officer</p>
                      <p className="text-gray-600 leading-relaxed">
                        Driving operational excellence and strategic growth, ensuring Whitlin 
                        continues to set industry standards in hospitality linen solutions.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Star className="w-16 h-16 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaibhav Singla</h3>
                      <p className="text-amber-600 font-semibold mb-4 text-lg">Managing Director</p>
                      <p className="text-gray-600 leading-relaxed">
                        Overseeing business development and market expansion, building strategic 
                        partnerships with leading hospitality brands worldwide.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.4}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Shield className="w-16 h-16 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Md Shifat Ullah</h3>
                      <p className="text-amber-600 font-semibold mb-4 text-lg">Chief Operating Officer</p>
                      <p className="text-gray-600 leading-relaxed">
                        Managing day-to-day operations and ensuring seamless execution of our 
                        commitment to quality and customer satisfaction.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.5}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-16 h-16 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Marjan Akter</h3>
                      <p className="text-amber-600 font-semibold mb-4 text-lg">Chief Technical Officer</p>
                      <p className="text-gray-600 leading-relaxed">
                        Leading innovation and technology initiatives, ensuring Whitlin stays 
                        at the forefront of textile manufacturing and product development.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-amber-100 text-amber-800">
                    Why Choose Whitlin
                  </Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    The Whitlin Difference
                  </h2>
                </div>
              </ScrollAnimate>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm hover-lift">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Hospitality Grade</h3>
                      <p className="text-sm text-gray-600">
                        Premium quality linens for hotels and resorts
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">100% Organic Cotton</h3>
                      <p className="text-sm text-gray-600">
                        Long staple, single ply organic cotton
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Durable & Elegant</h3>
                      <p className="text-sm text-gray-600">
                        Designed for long-lasting performance and luxury
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.4}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Customer First</h3>
                      <p className="text-sm text-gray-600">
                        Dedicated support and satisfaction guarantee
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <ScrollAnimate animation="fade-in-up" delay={0.1}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Elevate Your Hospitality Experience?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join 7,000+ satisfied clients worldwide who trust Whitlin for their premium 
                  hospitality linen needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      Shop Our Products
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
