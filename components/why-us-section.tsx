"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Users, Package, TrendingUp } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const stats = [
  {
    icon: Users,
    value: "7,000+",
    label: "Clients Worldwide"
  },
  {
    icon: Package,
    value: "5000+",
    label: "Ready to Deliver SKUs"
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Client Satisfaction"
  },
  {
    icon: Award,
    value: "40+",
    label: "Years of Excellence (Since 1984)"
  }
]

export function WhyUsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Static Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      </div>
      
      {/* Static gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollAnimate animation="fade-in-up">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Why Us?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Deliver a five-star guest experience with Whitlin's Premium Hospitality Linen Collection—a full-service solution 
                designed to meet the demanding standards of top-tier hotels, resorts, and serviced residences. 
                Crafted from 100% virgin cotton for bed linen and 100% Egyptian cotton for bath linen, our linens are soft, 
                breathable, durable, and elegant—making them the perfect blend of comfort and professionalism.
              </p>
            </div>
          </ScrollAnimate>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {stats.map((stat, index) => (
              <ScrollAnimate 
                key={index}
                animation="scale-in"
                delay={index * 100}
              >
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-all duration-300 hover-lift hover:border-white/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <stat.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-gray-300">
                      {stat.label}
                    </div>
                  </div>
              </div>
              </ScrollAnimate>
            ))}
          </div>

          {/* CTA Button */}
          <ScrollAnimate animation="fade-in-up" delay={400}>
            <div className="text-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover-glow"
                >
                  Shop Now!
                </Button>
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  )
}

