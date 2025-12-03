"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const categories = [
  {
    name: "BED",
    image: "/images/post-treatment.jpeg",
    href: "/products?category=bed"
  },
  {
    name: "BATH",
    image: "/images/inforcer-range.jpeg",
    href: "/products?category=bath"
  },
  {
    name: "FnB",
    image: "/images/no-yellow-range.jpeg",
    href: "/products?category=fnb"
  },
  {
    name: "Hotel",
    image: "/images/expert-liss-range.jpeg",
    href: "/products?category=hotel"
  },
  {
    name: "CURTAIN",
    image: "/images/regenerating-range.jpeg",
    href: "/products?category=curtain"
  }
]

export function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Explore Collections</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our premium hospitality linen collections designed for luxury and comfort
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <ScrollAnimate 
              key={index}
              animation="scale-in"
              delay={index * 100}
            >
              <Link href={category.href}>
                <Card className="group relative h-72 md:h-96 overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer hover-lift rounded-2xl">
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/20 transition-all duration-700" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-700" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <CardContent className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-white drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 border border-white/30">
                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <div className="mt-4 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full" />
                  </CardContent>
                </Card>
              </Link>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  )
}

