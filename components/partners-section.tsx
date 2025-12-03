"use client"

import Image from "next/image"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Trusted Partners</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Our Partners
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trusted by leading hotels, resorts, and hospitality establishments worldwide
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-6xl mx-auto">
          <Carousel
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
                    <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 md:p-8 rounded-xl text-center hover:from-white hover:to-gray-100 transition-all duration-500 border border-gray-200/50 hover:border-primary/30 hover-lift hover:shadow-xl relative overflow-hidden group h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="h-24 w-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 overflow-hidden relative">
                          {partner.logo && partner.logo !== "/placeholder.svg" ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              fill
                              className="object-contain p-2"
                              sizes="96px"
                            />
                          ) : (
                            <IconComponent className="h-12 w-12 text-gray-600 group-hover:text-primary transition-colors duration-500" />
                          )}
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">{partner.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-primary/30 transition-colors">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Trusted Partner</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary shadow-lg hover:shadow-xl" />
            <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary shadow-lg hover:shadow-xl" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

