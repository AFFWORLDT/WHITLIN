"use client"

import { Droplets, Shield, Wind, Thermometer, Heart, Sparkles } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const benefits = [
  {
    icon: Droplets,
    title: "Moisture Wicking",
    description: "Advanced technology that draws moisture away, keeping you cool and comfortable throughout the night"
  },
  {
    icon: Shield,
    title: "Non Toxic",
    description: "100% organic cotton, free from harmful chemicals and toxins for safe, healthy sleep"
  },
  {
    icon: Wind,
    title: "Breathable",
    description: "Natural cotton fibers allow air to circulate, ensuring a comfortable sleeping environment"
  },
  {
    icon: Thermometer,
    title: "Temperature Regulating",
    description: "Maintains optimal temperature for year-round comfort, keeping you cool in summer and warm in winter"
  },
  {
    icon: Heart,
    title: "Naturally Hypoallergenic",
    description: "Gentle on sensitive skin, suitable for all sleepers including those with allergies"
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Long staple, single-ply cotton for durability and luxury that lasts"
  }
]

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(212,175,55,0.03),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Benefits of Our Sheets
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our premium hospitality linen collection designed for ultimate comfort and durability
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollAnimate 
              key={index} 
              animation="scale-in" 
              delay={index * 100}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-primary/40 group hover-lift relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/15 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl">
                    <benefit.icon className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-125" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  )
}

