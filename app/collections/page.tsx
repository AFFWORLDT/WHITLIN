"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    id: "keratin-treatment",
    name: "Keratin Treatment",
    description: "Professional-grade keratin treatments for smooth, frizz-free hair that lasts up to 3 months.",
    image: "/collections/keratin-treatment.jpg",
    productCount: 8,
    featured: true,
    badge: "Best Seller",
    icon: Crown,
    gradient: "from-amber-400 to-orange-500"
  },
  {
    id: "hair-repair",
    name: "Hair Repair",
    description: "Intensive repair treatments for damaged, over-processed, or chemically treated hair.",
    image: "/collections/hair-repair.jpg",
    productCount: 12,
    featured: true,
    badge: "New",
    icon: Shield,
    gradient: "from-blue-400 to-purple-500"
  },
  {
    id: "color-protection",
    name: "Color Protection",
    description: "Specialized products to maintain vibrant color and prevent fading for colored hair.",
    image: "/collections/color-protection.jpg",
    productCount: 6,
    featured: false,
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-500"
  },
  {
    id: "volume-boost",
    name: "Volume Boost",
    description: "Lightweight formulas that add body, volume, and bounce to fine or limp hair.",
    image: "/collections/volume-boost.jpg",
    productCount: 9,
    featured: false,
    icon: Zap,
    gradient: "from-green-400 to-emerald-500"
  },
  {
    id: "natural-care",
    name: "Natural Care",
    description: "Organic and natural ingredients for gentle, effective hair care without harsh chemicals.",
    image: "/collections/natural-care.jpg",
    productCount: 15,
    featured: true,
    badge: "Organic",
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "styling-essentials",
    name: "Styling Essentials",
    description: "Professional styling products for heat protection, hold, and finishing touches.",
    image: "/collections/styling-essentials.jpg",
    productCount: 11,
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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
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
                Each collection is carefully curated to address specific hair care needs, 
                featuring professional-grade formulations and luxurious ingredients.
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
                  Our most popular and highly-rated product lines
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredCollections.map((collection) => {
                  const IconComponent = collection.icon
                  return (
                    <Card key={collection.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
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
                  Browse our complete range of professional hair care collections
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allCollections.map((collection) => {
                  const IconComponent = collection.icon
                  return (
                    <Card key={collection.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
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
                  Each collection is designed with your hair's unique needs in mind
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Crown className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Grade</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Salon-quality formulations that deliver professional results in the comfort of your home.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Scientifically Formulated</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Each product is backed by extensive research and clinical testing for maximum effectiveness.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Luxury Experience</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Indulge in premium ingredients and elegant packaging that makes every use a luxury experience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Hair?
              </h2>
              <p className="text-xl text-amber-100 mb-8">
                Explore our collections and find the perfect products for your hair care routine.
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
                    Get Personalized Advice
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
