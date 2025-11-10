"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
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
  Zap,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react"
import dynamic from "next/dynamic"

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
  overlay?: string
  textPosition?: 'left' | 'center' | 'right'
  theme?: 'dark' | 'light'
}

const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Professional Hair Care",
    subtitle: "Redefined",
    description: "Transform your hair with our luxury keratin and hyaluronic acid treatments. Professional results, salon-quality care that exceeds expectations.",
    image: "/hero.png",
    primaryButton: {
      text: "Shop Now",
      href: "/products"
    },
    secondaryButton: {
      text: "View Collections",
      href: "/collections"
    },
    overlay: "KERAGOLD PRO",
    textPosition: 'center',
    theme: 'dark'
  },
  {
    id: "slide-2",
    title: "Premium Hair Solutions",
    subtitle: "Expert Formulations",
    description: "Discover our exclusive range of professional-grade hair treatments. Advanced technology meets luxury ingredients for unparalleled results.",
    image: "/hero2.png",
    primaryButton: {
      text: "Explore Products",
      href: "/products"
    },
    secondaryButton: {
      text: "Book Consultation",
      href: "/contact"
    },
    overlay: "PREMIUM",
    textPosition: 'left',
    theme: 'light'
  },
  {
    id: "slide-3",
    title: "Luxury Hair Care",
    subtitle: "Salon Quality",
    description: "Experience the ultimate in hair transformation with our cutting-edge formulations. Professional-grade treatments for salon-perfect results at home.",
    image: "/hero3.png",
    primaryButton: {
      text: "Shop Luxury",
      href: "/products"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    overlay: "LUXURY",
    textPosition: 'right',
    theme: 'dark'
  }
]

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Touch gesture handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    
    setIsTransitioning(true)
    setCurrentSlide(index)
    
    setTimeout(() => setIsTransitioning(false), 500)
  }, [currentSlide, isTransitioning])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)
  }, [currentSlide, goToSlide])

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000) // Change slide every 6 seconds

    return () => clearInterval(interval)
  }, [])

  const currentSlideData = heroSlides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Slider Section */}
      <section 
        ref={sliderRef}
        className="relative h-[90vh] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Image with Enhanced Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={currentSlideData.image || '/hero.png'}
            alt={currentSlideData.title}
            fill
            className="object-cover transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
            priority={currentSlide === 0}
            sizes="100vw"
            quality={85}
          />
          
          {/* Enhanced Dynamic Overlay with Gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            currentSlideData.theme === 'dark' 
              ? 'bg-gradient-to-br from-black/50 via-black/30 to-black/60' 
              : 'bg-gradient-to-br from-white/30 via-white/10 to-white/40'
          }`} />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          
          {/* Brand Overlay with Enhanced Styling */}
          {currentSlideData.overlay && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 rotate-90 hidden lg:block">
              <div className="text-white/5 text-8xl font-black tracking-widest drop-shadow-2xl">
                {currentSlideData.overlay}
              </div>
            </div>
          )}
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-1000" />
          <div className="absolute top-32 right-32 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-2000" />
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-3000" />
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-full p-3 md:p-4 transition-all duration-300 disabled:opacity-50 hover:scale-110 shadow-lg hover:shadow-xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-full p-3 md:p-4 transition-all duration-300 disabled:opacity-50 hover:scale-110 shadow-lg hover:shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </button>

        {/* Enhanced Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className={`max-w-5xl ${
              currentSlideData.textPosition === 'left' 
                ? 'text-left' 
                : currentSlideData.textPosition === 'right'
                ? 'text-right ml-auto'
                : 'text-center mx-auto'
            }`}>
              {/* Enhanced Title with Gradient Text */}
              <h1 className={`font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 text-balance transition-all duration-700 transform ${
                isTransitioning ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.theme === 'dark' 
                  ? 'text-white drop-shadow-2xl' 
                  : 'text-gray-900 drop-shadow-lg'
              }`}>
                <span className="block leading-tight">
                  {currentSlideData.title}
                </span>
                <span className={`block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight bg-gradient-to-r ${
                  currentSlideData.theme === 'dark' 
                    ? 'from-primary via-yellow-400 to-primary bg-clip-text text-transparent' 
                    : 'from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent'
                }`}>
                  {currentSlideData.subtitle}
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-pretty max-w-3xl transition-all duration-700 transform delay-100 ${
                isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.textPosition === 'center' ? 'mx-auto' : ''
              } ${
                currentSlideData.theme === 'dark' 
                  ? 'text-white/95 drop-shadow-lg' 
                  : 'text-gray-800 drop-shadow-sm'
              } font-medium leading-relaxed`}>
                {currentSlideData.description}
              </p>

              {/* Enhanced Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 transition-all duration-700 transform delay-200 ${
                isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.textPosition === 'center' ? 'justify-center' : ''
              }`}>
                <Link href={currentSlideData.primaryButton.href}>
                  <Button 
                    size="lg" 
                    className={`font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg transition-all duration-300 w-full sm:w-auto hover:scale-105 shadow-xl hover:shadow-2xl ${
                      currentSlideData.theme === 'dark'
                        ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    }`}
                  >
                    {currentSlideData.primaryButton.text}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className={`border-2 font-bold px-8 md:px-10 py-4 md:py-5 text-base md:text-lg transition-all duration-300 w-full sm:w-auto hover:scale-105 backdrop-blur-sm ${
                    currentSlideData.theme === 'dark'
                      ? 'border-white/80 text-white hover:bg-white hover:text-black bg-white/10'
                      : 'border-gray-900/80 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/20'
                  }`}
                  onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore Collections
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-125 ${
                  index === currentSlide
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

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
