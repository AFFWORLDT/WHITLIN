"use client"

import React from "react"
import Image from "next/image"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Building2, Hotel, Briefcase } from "lucide-react"

const partners = [
  {
    name: "Rixos Hotels",
    description: "Luxury Hospitality Partner",
    logo: "/images/partner/partner1.png",
    icon: Hotel
  },
  {
    name: "Seven Seas Hotel",
    description: "Five Grand Resort Partner",
    logo: "/images/partner/partner2.jfif",
    icon: Hotel
  },
  {
    name: "X Hair Lounge",
    description: "Premium Business Partner",
    logo: "/images/partner/partner3.png",
    icon: Briefcase
  },
  {
    name: "Hilton",
    description: "Global Hospitality Leader",
    logo: "/images/partner/partner4.png",
    icon: Hotel
  },
  {
    name: "Radisson",
    description: "International Hotel Chain",
    logo: "/images/partner/partner5.png",
    icon: Hotel
  },
  {
    name: "Marriott",
    description: "World-Class Hospitality",
    logo: "/images/partner/partner6.jfif",
    icon: Hotel
  },
  {
    name: "Himalayan Heights",
    description: "Real Estate Investment Group",
    logo: "/images/partner/partner7.png",
    icon: Building2
  },
  {
    name: "Taj",
    description: "Luxury Hospitality Icon",
    logo: "/images/partner/partner8.png",
    icon: Hotel
  },
  {
    name: "Bravia Hotel",
    description: "Premium Hospitality Partner",
    logo: "/images/partner/partner9.png",
    icon: Hotel
  }
]

export function PartnersSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Auto-play functionality
  React.useEffect(() => {
    if (!api || isPaused) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 3000) // Auto-slide every 3 seconds

    return () => clearInterval(interval)
  }, [api, isPaused])

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e1d7c6]/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,215,198,0.04),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-[#e1d7c6] text-sm font-semibold uppercase tracking-wider">Trusted Partners</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#1a1a1a]">
              Our Partners
            </h2>
            <p className="text-lg md:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed">
              Trusted by leading hotels, resorts, and hospitality establishments worldwide
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-6xl mx-auto">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
            <CarouselContent className="-ml-2 md:-ml-4">
              {partners.map((partner, index) => {
                const IconComponent = partner.icon
                return (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="bg-white p-6 md:p-8 rounded-xl text-center hover:bg-[#fafafa] transition-all duration-500 border border-[#e5e5e5] hover:border-[#e1d7c6] hover-lift hover:shadow-xl relative overflow-hidden group h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e1d7c6]/0 via-[#e1d7c6]/0 to-[#e1d7c6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="h-24 w-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 overflow-hidden relative border border-[#e5e5e5] group-hover:border-[#e1d7c6]">
                          {partner.logo && partner.logo !== "/placeholder.svg" ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              fill
                              className="object-contain p-2"
                              sizes="96px"
                            />
                          ) : (
                            <IconComponent className="h-12 w-12 text-[#404040] group-hover:text-[#e1d7c6] transition-colors duration-500" />
                          )}
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-2 text-[#1a1a1a] group-hover:text-[#e1d7c6] transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-[#404040] font-medium">{partner.description}</p>
                        <div className="mt-4 pt-4 border-t border-[#e5e5e5] group-hover:border-[#e1d7c6]/30 transition-colors">
                          <span className="text-xs text-[#737373] uppercase tracking-wider">Trusted Partner</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-[#e5e5e5] hover:border-[#e1d7c6] shadow-lg hover:shadow-xl" />
            <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-[#e5e5e5] hover:border-[#e1d7c6] shadow-lg hover:shadow-xl" />
          </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

