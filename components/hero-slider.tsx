"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
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

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
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

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevSlide, nextSlide, togglePlayPause])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000) // Change slide every 6 seconds

    return () => clearInterval(interval)
  }, [isPlaying])

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0)
      return
    }

    setProgress(0)
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((elapsed / 6000) * 100, 100)
      setProgress(progressPercent)
      
      if (progressPercent < 100) {
        requestAnimationFrame(updateProgress)
      }
    }
    
    requestAnimationFrame(updateProgress)
  }, [isPlaying, currentSlide])

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section 
      ref={sliderRef}
      className="relative h-[60vh] min-h-[400px] sm:h-[65vh] sm:min-h-[450px] md:h-[70vh] md:min-h-[500px] lg:h-[80vh] lg:min-h-[600px] xl:min-h-[700px] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image with Enhanced Effects */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
          priority={currentSlide === 0}
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

        {/* Enhanced Navigation Arrows - Mobile Optimized */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-1 sm:left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300 disabled:opacity-50 active:scale-95 hover:scale-110 shadow-lg hover:shadow-xl touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-1 sm:right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300 disabled:opacity-50 active:scale-95 hover:scale-110 shadow-lg hover:shadow-xl touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </button>


        {/* Enhanced Content - Mobile Optimized */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <div className={`max-w-6xl ${
              currentSlideData.textPosition === 'left' 
                ? 'text-left' 
                : currentSlideData.textPosition === 'right'
                ? 'text-right ml-auto'
                : 'text-center mx-auto'
            }`}>
              {/* Enhanced Title with Gradient Text - Mobile Responsive */}
              <h1 className={`font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 md:mb-6 text-balance transition-all duration-700 transform ${
                isTransitioning ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.theme === 'dark' 
                  ? 'text-white drop-shadow-2xl' 
                  : 'text-gray-900 drop-shadow-lg'
              }`}>
                <span className="block leading-tight">
                  {currentSlideData.title}
                </span>
                <span className={`block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight bg-gradient-to-r ${
                  currentSlideData.theme === 'dark' 
                    ? 'from-primary via-yellow-400 to-primary bg-clip-text text-transparent' 
                    : 'from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent'
                }`}>
                  {currentSlideData.subtitle}
                </span>
              </h1>

              {/* Enhanced Description - Mobile Optimized */}
              <p className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-pretty max-w-4xl transition-all duration-700 transform delay-100 ${
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

              {/* Enhanced Buttons - Mobile Optimized */}
              <div className={`flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-6 transition-all duration-700 transform delay-200 ${
                isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.textPosition === 'center' ? 'justify-center' : ''
              }`}>
                <Link href={currentSlideData.primaryButton.href}>
                  <Button 
                    size="lg" 
                    className={`font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg transition-all duration-300 w-full xs:w-auto hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl touch-manipulation ${
                      currentSlideData.theme === 'dark'
                        ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    }`}
                  >
                    {currentSlideData.primaryButton.text}
                  </Button>
                </Link>
                <Link href={currentSlideData.secondaryButton.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`border-2 font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg transition-all duration-300 w-full xs:w-auto hover:scale-105 active:scale-95 backdrop-blur-sm touch-manipulation ${
                      currentSlideData.theme === 'dark'
                        ? 'border-white/80 text-white hover:bg-white hover:text-black bg-white/10'
                        : 'border-gray-900/80 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/20'
                    }`}
                  >
                    {currentSlideData.secondaryButton.text}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>


    </section>
  )
}

// Export as dynamic component to prevent hydration issues
const DynamicHeroSlider = dynamic(() => Promise.resolve(HeroSlider), {
  ssr: false,
  loading: () => (
    <section className="relative h-[70vh] min-h-[500px] md:h-[80vh] md:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gray-100 animate-pulse">
      <div className="absolute inset-0 bg-gray-200" />
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 bg-gray-300 rounded mb-4 w-96 mx-auto"></div>
          <div className="h-6 bg-gray-300 rounded mb-8 w-64 mx-auto"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-10 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default DynamicHeroSlider
