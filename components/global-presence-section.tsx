"use client"

import { ScrollAnimate } from "@/components/scroll-animate"
import { Globe, MapPin, Building2 } from "lucide-react"

const countries = [
  "Australia", "Bangladesh", "Botswana", "Canada", "England", 
  "Israel", "Europe", "Japan", "Kuwait", "Mauritius", 
  "South Africa", "United States of America", "United Arab Emirates"
]

export function GlobalPresenceSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,215,198,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(225,215,198,0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-[#e1d7c6] text-sm font-semibold uppercase tracking-wider">Worldwide Reach</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#1a1a1a]">
              Global Presence
            </h2>
            <p className="text-lg md:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed">
              With a strong global distribution network, we have warehouses, manufacturing facilities, 
              headquarters, and marketing offices across multiple continents.
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-[#e5e5e5] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e1d7c6]/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e1d7c6]/5 rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#e1d7c6]/20 to-[#e1d7c6]/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-10 h-10 text-[#e1d7c6]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {countries.map((country, index) => (
                  <ScrollAnimate 
                    key={country}
                    animation="scale-in"
                    delay={index * 50}
                  >
                    <div className="bg-white p-4 rounded-xl text-center hover:bg-[#fafafa] hover:shadow-lg transition-all duration-300 border border-[#e5e5e5] hover:border-[#e1d7c6] hover-lift group">
                      <MapPin className="w-5 h-5 text-[#e1d7c6] mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-sm md:text-base font-semibold text-[#1a1a1a] group-hover:text-[#e1d7c6] transition-colors duration-300">
                        {country}
                      </p>
                    </div>
                  </ScrollAnimate>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#e5e5e5]">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-6 bg-[#fafafa] rounded-xl">
                    <Building2 className="w-8 h-8 text-[#e1d7c6] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a1a1a] mb-2">Warehouses</h3>
                    <p className="text-sm text-[#404040]">Strategic locations worldwide</p>
                  </div>
                  <div className="p-6 bg-[#fafafa] rounded-xl">
                    <Building2 className="w-8 h-8 text-[#e1d7c6] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a1a1a] mb-2">Manufacturing</h3>
                    <p className="text-sm text-[#404040]">State-of-the-art facilities</p>
                  </div>
                  <div className="p-6 bg-[#fafafa] rounded-xl">
                    <Building2 className="w-8 h-8 text-[#e1d7c6] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a1a1a] mb-2">Offices</h3>
                    <p className="text-sm text-[#404040]">Global headquarters & branches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

