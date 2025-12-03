"use client"

import { useState } from "react"
import Link from "next/link"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Sparkles, 
  Star, 
  Play, 
  ChevronRight,
  Award,
  Gem,
  Zap
} from "lucide-react"

interface ProductCategory {
  id: string
  name: string
  description: string
  image: string
  groupImage: string
  products: string[]
  color: string
  gradient: string
  icon: React.ReactNode
  features: string[]
  premium: boolean
}

const luxuryCategories: ProductCategory[] = [
  {
    id: "ab",
    name: "AB Collection",
    description: "Advanced Bonding Technology for Ultimate Hair Repair",
    image: "/AB/AB.png",
    groupImage: "/AB/GROUPE/Gamme AB.jpg",
    products: ["/AB/AB(1).png", "/AB/AB(2).png", "/AB/AB(3).png"],
    color: "bg-gradient-to-br from-purple-600 to-indigo-800",
    gradient: "from-purple-500/20 to-indigo-600/20",
    icon: <Zap className="w-6 h-6" />,
    features: ["Advanced Bonding", "Repair Technology", "Professional Grade"],
    premium: true
  },
  {
    id: "ac",
    name: "AC Collection", 
    description: "Anti-Curl System for Perfect Straightening Results",
    image: "/AC/AC.png",
    groupImage: "/AC/GROUPE/Gamme AC.jpg",
    products: ["/AC/AC(1).png", "/AC/AC(2).png", "/AC/AC(3).png", "/AC/AC(4).png", "/AC/AC(5).png"],
    color: "bg-gradient-to-br from-blue-600 to-cyan-800",
    gradient: "from-blue-500/20 to-cyan-600/20",
    icon: <Gem className="w-6 h-6" />,
    features: ["Anti-Curl Technology", "Straightening Power", "Long-lasting Results"],
    premium: true
  },
  {
    id: "bc",
    name: "BC Collection",
    description: "Bonding & Conditioning for Healthy Hair Transformation",
    image: "/BC/BC.png", 
    groupImage: "/BC/GROUPE/Gamme BC.jpg",
    products: ["/BC/BC(1).png", "/BC/BC(2).png", "/BC/BC(3).png", "/BC/BC(4).png"],
    color: "bg-gradient-to-br from-emerald-600 to-teal-800",
    gradient: "from-emerald-500/20 to-teal-600/20",
    icon: <Award className="w-6 h-6" />,
    features: ["Bonding Technology", "Deep Conditioning", "Hair Health"],
    premium: true
  },
  {
    id: "cc",
    name: "CC Collection",
    description: "Color Care System for Vibrant, Protected Hair",
    image: "/CC/GROUPE/Gamme CC.jpg",
    groupImage: "/CC/GROUPE/Gamme CC.jpg", 
    products: ["/CC/GROUPE/TTD_2516.png", "/CC/GROUPE/TTD_2517.png", "/CC/GROUPE/TTD_2518.png", "/CC/GROUPE/TTD_2520.png"],
    color: "bg-gradient-to-br from-rose-600 to-pink-800",
    gradient: "from-rose-500/20 to-pink-600/20",
    icon: <Sparkles className="w-6 h-6" />,
    features: ["Color Protection", "Vibrant Results", "Professional Care"],
    premium: true
  },
  {
    id: "dd",
    name: "DD Collection",
    description: "Deep Detox & Damage Repair for Ultimate Hair Recovery",
    image: "/DD/DD.png",
    groupImage: "/DD/GROUPE/Gamme DD.jpg",
    products: ["/DD/DD(1).png", "/DD/DD(2).png", "/DD/DD(3).png", "/DD/DD(4).png"],
    color: "bg-gradient-to-br from-amber-600 to-orange-800",
    gradient: "from-amber-500/20 to-orange-600/20",
    icon: <Crown className="w-6 h-6" />,
    features: ["Deep Detox", "Damage Repair", "Ultimate Recovery"],
    premium: true
  },
  {
    id: "fb",
    name: "FB Collection",
    description: "Fiber Bonding Technology for Maximum Hair Strength",
    image: "/FB/FB.png",
    groupImage: "/FB/GROUPE/Gamme FB.jpg",
    products: ["/FB/FB(1).png", "/FB/FB(2).png", "/FB/FB(3).png", "/FB/FB(4).png", "/FB/FB(5).png", "/FB/FB(6).png"],
    color: "bg-gradient-to-br from-violet-600 to-purple-800",
    gradient: "from-violet-500/20 to-purple-600/20",
    icon: <Star className="w-6 h-6" />,
    features: ["Fiber Bonding", "Maximum Strength", "Professional Results"],
    premium: true
  },
  {
    id: "green",
    name: "KG GREEN Collection",
    description: "Natural & Organic Hair Care with Premium Ingredients",
    image: "/GREEN/ALOEVERA BANANE/GREEN.png",
    groupImage: "/GREEN/ALOEVERA BANANE/GROUPE/Gamme KG Green Aloe Banana.jpg",
    products: ["/GREEN/ALOEVERA BANANE/GREEN(1).png", "/GREEN/ALOEVERA BANANE/GREEN(2).png", "/GREEN/ALOEVERA BANANE/GREEN(3).png"],
    color: "bg-gradient-to-br from-green-600 to-emerald-800",
    gradient: "from-green-500/20 to-emerald-600/20",
    icon: <Sparkles className="w-6 h-6" />,
    features: ["Natural Ingredients", "Organic Formula", "Eco-Friendly"],
    premium: true
  },
  {
    id: "sv",
    name: "SV Collection",
    description: "Silver & Volumizing System for Luxurious Hair Volume",
    image: "/SV/SV.png",
    groupImage: "/SV/GROUPE/Gamme SV.jpg",
    products: ["/SV/SV(1).png", "/SV/SV(2).png"],
    color: "bg-gradient-to-br from-slate-600 to-gray-800",
    gradient: "from-slate-500/20 to-gray-600/20",
    icon: <Gem className="w-6 h-6" />,
    features: ["Silver Technology", "Volume Enhancement", "Luxury Care"],
    premium: true
  },
  {
    id: "xl",
    name: "XL Collection",
    description: "Extra Long Keratin & Silk for Maximum Hair Length",
    image: "/XL/XL.png",
    groupImage: "/XL/GROUPE/Gamme XL Kératine Soie.jpg",
    products: ["/XL/XL(1).png", "/XL/XL(2).png", "/XL/XL(3).png", "/XL/XL(4).png", "/XL/XL(5).png"],
    color: "bg-gradient-to-br from-gold-600 to-yellow-800",
    gradient: "from-yellow-500/20 to-amber-600/20",
    icon: <Crown className="w-6 h-6" />,
    features: ["Extra Length", "Keratin & Silk", "Maximum Results"],
    premium: true
  }
]

export function LuxuryShowcase() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Collections Grid */}
      <section id="collections" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Luxury Collections
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Each collection is meticulously crafted with premium ingredients and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {luxuryCategories.map((category) => (
              <Card 
                key={category.id}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 bg-white/95 backdrop-blur-sm h-auto sm:h-[520px] flex flex-col rounded-xl shadow-lg hover:shadow-2xl"
              >
                <div className={`relative h-48 sm:h-56 md:h-64 ${category.color} overflow-hidden flex-shrink-0 w-full`}>
                  <MobileProductGridImage
                    src={category.groupImage || category.image || '/placeholder.jpg'}
                    alt={category.name}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Premium Badge */}
                  {category.premium && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      PREMIUM
                    </Badge>
                  )}

                  {/* Category Icon */}
                  <div className="absolute bottom-4 left-4 text-white">
                    {category.icon}
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 flex flex-col flex-grow min-h-0">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-1 h-7 sm:h-8 flex items-center">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 h-14 sm:h-16 flex items-start">
                    {category.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4 h-12 overflow-hidden">
                    {category.features.slice(0, 3).map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link href={`/collections/${category.id === 'green' ? 'kg-green' : category.id}`}>
                      <Button 
                        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold"
                      >
                        Explore Collection
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 text-white border-white hover:bg-white hover:text-black"
              onClick={() => setIsVideoPlaying(false)}
            >
              ×
            </Button>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Video Player Placeholder</p>
                <p className="text-sm opacity-75">Add your product demonstration video here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
