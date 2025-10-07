"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Heart className="w-4 h-4 mr-2" />
                About KeraGold Pro
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Transforming Hair Care with 
                <span className="text-amber-600"> Luxury & Science</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We believe every woman deserves to feel confident and beautiful. Our professional-grade 
                hair care products combine cutting-edge science with luxurious ingredients to deliver 
                transformative results.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Professional Grade</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Leaf className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Natural Ingredients</span>
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
                <div>
                  <Badge className="mb-4 bg-amber-100 text-amber-800">
                    Our Story
                  </Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Born from a Passion for Beautiful Hair
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    KeraGold Pro was founded by a team of hair care professionals who noticed a gap 
                    in the market for truly effective, professional-grade products that could be used 
                    at home. After years of working in salons and seeing the limitations of consumer 
                    products, we set out to create something better.
                  </p>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Our journey began with extensive research into keratin treatments, hair repair 
                    technologies, and the science of hair health. We partnered with leading cosmetic 
                    chemists and hair care experts to develop formulations that deliver salon-quality 
                    results in the comfort of your own home.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">10+ Years Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Expert Formulated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Clinically Tested</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <Card className="bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                          <h3 className="font-bold text-lg mb-2">Award Winning</h3>
                          <p className="text-sm text-gray-600">Best Hair Care Brand 2024</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                          <h3 className="font-bold text-lg mb-2">500K+</h3>
                          <p className="text-sm text-gray-600">Happy Customers</p>
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
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-100 text-amber-800">
                  Our Mission
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Empowering Women Through Beautiful Hair
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're committed to providing professional-grade hair care solutions that help 
                  women feel confident, beautiful, and empowered every day.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Target className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To revolutionize home hair care by making professional-grade treatments 
                      accessible to every woman, empowering them to achieve salon-quality results 
                      in their own space.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To become the global leader in professional home hair care, setting new 
                      standards for quality, innovation, and customer satisfaction in the beauty industry.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Quality, innovation, integrity, and customer-centricity guide everything we do. 
                      We believe in transparency, sustainability, and empowering our customers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-100 text-amber-800">
                  Meet Our Team
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  The Experts Behind KeraGold Pro
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our team of hair care professionals, cosmetic chemists, and beauty experts 
                  work tirelessly to bring you the best products.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-16 h-16 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Sarah Chen</h3>
                    <p className="text-amber-600 font-medium mb-4">Chief Scientific Officer</p>
                    <p className="text-gray-600 leading-relaxed">
                      PhD in Cosmetic Chemistry with 15+ years in hair care formulation. 
                      Led the development of our signature keratin treatments.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Award className="w-16 h-16 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Maria Rodriguez</h3>
                    <p className="text-amber-600 font-medium mb-4">Head of Product Development</p>
                    <p className="text-gray-600 leading-relaxed">
                      Licensed cosmetologist and former salon owner with expertise in 
                      professional hair treatments and customer needs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">James Thompson</h3>
                    <p className="text-amber-600 font-medium mb-4">Quality Assurance Director</p>
                    <p className="text-gray-600 leading-relaxed">
                      Ensures every product meets our high standards through rigorous 
                      testing and quality control processes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-100 text-amber-800">
                  Why Choose KeraGold Pro
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  The KeraGold Pro Difference
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Professional Grade</h3>
                    <p className="text-sm text-gray-600">
                      Salon-quality formulations for home use
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Natural Ingredients</h3>
                    <p className="text-sm text-gray-600">
                      Premium natural and organic components
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Safe & Tested</h3>
                    <p className="text-sm text-gray-600">
                      Clinically tested and dermatologist approved
                    </p>
                  </CardContent>
                </Card>

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
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Hair?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of satisfied customers who have discovered the power of 
                professional-grade hair care at home.
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
