"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  Sparkles, 
  Crown, 
  Heart, 
  Star, 
  ArrowRight,
  Shield,
  Leaf,
  Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Collection {
  id: string
  name: string
  description: string
  image: string
  productCount: number
  featured: boolean
  badge?: string
  icon: React.ComponentType<any>
  gradient: string
}

const collections: Collection[] = [
  {
    id: "bed-linen",
    name: "Bed Linen",
    description: "Premium 100% organic, long staple cotton bed linen. Ultimate comfort - soft, breathable & designed for deep sleep.",
    image: "/collections/bed-linen.jpg",
    productCount: 150,
    featured: true,
    badge: "Best Seller",
    icon: Crown,
    gradient: "from-amber-400 to-orange-500"
  },
  {
    id: "bath-linen",
    name: "Bath Linen",
    description: "Luxurious 100% Egyptian cotton bath towels, face towels, and bath accessories for premium hospitality experiences.",
    image: "/collections/bath-linen.jpg",
    productCount: 120,
    featured: true,
    badge: "Premium",
    icon: Shield,
    gradient: "from-blue-400 to-purple-500"
  },
  {
    id: "duvet-cover",
    name: "Duvet Cover",
    description: "Elegant duvet covers crafted from premium organic cotton, perfect for hotels and serviced residences.",
    image: "/collections/duvet-cover.jpg",
    productCount: 80,
    featured: false,
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-500"
  },
  {
    id: "pillows",
    name: "Pillows",
    description: "Comfortable and supportive pillows designed for hospitality use, ensuring restful sleep for guests.",
    image: "/collections/pillows.jpg",
    productCount: 45,
    featured: false,
    icon: Zap,
    gradient: "from-green-400 to-emerald-500"
  },
  {
    id: "hotel-collection",
    name: "Hotel Collection",
    description: "Complete hospitality linen solutions for hotels, resorts, and serviced residences. Full-service solution for top-tier establishments.",
    image: "/collections/hotel-collection.jpg",
    productCount: 500,
    featured: true,
    badge: "Featured",
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "curtain",
    name: "Curtain",
    description: "Premium curtains and window treatments designed for hospitality spaces, combining elegance with functionality.",
    image: "/collections/curtain.jpg",
    productCount: 60,
    featured: false,
    icon: Star,
    gradient: "from-purple-400 to-indigo-500"
  }
]

export default function CollectionsPage() {
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])

  useEffect(() => {
    setFeaturedCollections(collections.filter(c => c.featured))
    setAllCollections(collections)
  }, [])

  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-amber-50 to-orange-50 py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Crown className="w-4 h-4 mr-2" />
                Our Collections
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Discover Our 
                <span className="text-amber-600"> Premium Collections</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Each collection is carefully curated for hospitality excellence, 
                featuring premium organic cotton and Egyptian cotton linens for hotels, resorts, and serviced residences.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Featured Collections
                </h2>
                <p className="text-xl text-gray-600">
                  Our most popular and trusted hospitality linen collections
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredCollections.map((collection, index) => {
                  const IconComponent = collection.icon
                  return (
                    <ScrollAnimate key={collection.id} animation="fade-in-up" delay={index * 0.1}>
                      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover-lift">
                      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-20`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-20 h-20 bg-gradient-to-br ${collection.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {collection.name}
                            </h3>
                            {collection.badge && (
                              <Badge className={`bg-gradient-to-r ${collection.gradient} text-white border-0`}>
                                {collection.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-8">
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {collection.productCount} products
                          </span>
                          <Link href={`/products?category=${collection.id}`}>
                            <Button className="bg-amber-600 hover:bg-amber-700 group-hover:translate-x-1 transition-transform">
                              Explore Collection
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    </ScrollAnimate>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* All Collections Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  All Collections
                </h2>
                <p className="text-xl text-gray-600">
                  Browse our complete range of premium hospitality linen collections
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allCollections.map((collection, index) => {
                  const IconComponent = collection.icon
                  return (
                    <ScrollAnimate key={collection.id} animation="scale-in" delay={index * 0.1}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-30`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-16 h-16 bg-gradient-to-br ${collection.gradient} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {collection.name}
                            </h3>
                            {collection.badge && (
                              <Badge className={`bg-gradient-to-r ${collection.gradient} text-white border-0 text-xs mt-2`}>
                                {collection.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {collection.productCount} products
                          </span>
                          <Link href={`/products?category=${collection.id}`}>
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                              View Products
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    </ScrollAnimate>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Collection Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Choose Our Collections?
                </h2>
                <p className="text-xl text-gray-600">
                  Each collection is designed to meet the demanding standards of the hospitality industry
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow hover-lift">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Crown className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Hospitality Grade</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Premium quality linens that meet the demanding standards of top-tier hotels, resorts, and serviced residences.
                    </p>
                  </CardContent>
                </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Materials</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Crafted from 100% organic, long staple cotton for bed linen and 100% Egyptian cotton for bath linen.
                    </p>
                  </CardContent>
                </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Five-Star Experience</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Deliver exceptional guest experiences with soft, breathable, durable, and elegant linens.
                    </p>
                  </CardContent>
                </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Elevate Your Hospitality Experience?
              </h2>
              <p className="text-xl text-amber-100 mb-8">
                Explore our collections and find the perfect linen solutions for your hotel, resort, or serviced residence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                    Shop All Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                    Contact Our Team
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
