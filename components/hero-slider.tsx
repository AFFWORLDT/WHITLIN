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
    title: "Trusted Linen Excellence",
    subtitle: "Since 1984",
    description: "Discover premium-quality linen crafted with care and expertise. From luxurious duvets, bed sheets, and duvet covers to plush towels and more — Whitlin has been delivering comfort, style, and durability for over four decades around the globe.",
    image: "/hero.jpg",
    primaryButton: {
      text: "Shop Now",
      href: "/products"
    },
    secondaryButton: {
      text: "View Collections",
      href: "/collections"
    },
    overlay: "WHITLIN",
    textPosition: 'center',
    theme: 'light'
  },
  {
    id: "slide-2",
    title: "Elevate Your Everyday Living",
    subtitle: "Premium Hospitality Linen Solutions",
    description: "We proudly serve both B2B and B2C markets, partnering with leading hotels, corporate clients, and individual customers across the region. Experience the Whitlin standard — where quality meets elegance.",
    image: "/hero2.jpg",
    primaryButton: {
      text: "Explore Products",
      href: "/products"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    overlay: "PREMIUM",
    textPosition: 'center',
    theme: 'light'
  },
  {
    id: "slide-3",
    title: "Trusted by Prestigious Partners",
    subtitle: "Global Excellence in Hospitality Linen",
    description: "Deliver a five-star guest experience with Whitlin's Premium Hospitality Linen Collection—designed to meet the demanding standards of top-tier hotels, resorts, and serviced residences worldwide.",
    image: "/hero3.avif",
    primaryButton: {
      text: "Shop Now",
      href: "/products"
    },
    secondaryButton: {
      text: "View Collections",
      href: "/collections"
    },
    overlay: "LUXURY",
    textPosition: 'center',
    theme: 'light'
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
      className="relative h-[70vh] min-h-[500px] sm:h-[75vh] sm:min-h-[550px] md:h-[80vh] md:min-h-[600px] lg:h-[85vh] lg:min-h-[700px] xl:min-h-[800px] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image - Clear and Visible */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
          priority={currentSlide === 0}
        />
      </div>

        {/* Enhanced Navigation Arrows - Mobile Optimized */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-1 sm:left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300 disabled:opacity-50 active:scale-95 hover:scale-110 shadow-xl hover:shadow-2xl touch-manipulation hover:border-white/60 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-lg group-hover:translate-x-[-2px] transition-transform duration-300" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-1 sm:right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300 disabled:opacity-50 active:scale-95 hover:scale-110 shadow-xl hover:shadow-2xl touch-manipulation hover:border-white/60 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-lg group-hover:translate-x-[2px] transition-transform duration-300" />
        </button>


        {/* Enhanced Content - Mobile Optimized */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <div className="max-w-5xl text-center mx-auto">
              {/* Enhanced Title with Optima Font - Mobile Responsive */}
              <h1 className={`font-optima text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[48px] xl:text-[48px] mb-3 sm:mb-4 md:mb-6 text-balance transition-all duration-700 transform leading-normal ${
                isTransitioning ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } text-white drop-shadow-2xl`} style={{ fontWeight: 700 }}>
                <span className="block leading-normal mb-2">
                  {currentSlideData.title}
                </span>
                <span className="block font-optima text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-normal text-white/90" style={{ fontWeight: 700 }}>
                  {currentSlideData.subtitle}
                </span>
              </h1>

              {/* Enhanced Description - Mobile Optimized */}
              <p className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 text-pretty max-w-4xl mx-auto transition-all duration-700 transform delay-100 font-light leading-relaxed ${
                isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
              } ${
                currentSlideData.theme === 'dark' 
                  ? 'text-white/90 drop-shadow-lg' 
                  : 'text-white/90 drop-shadow-lg'
              }`}>
                {currentSlideData.description}
              </p>

              {/* Enhanced Buttons - Mobile Optimized */}
              <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-700 transform delay-200 ${
                isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
              }`}>
                <Link href={currentSlideData.primaryButton.href}>
                  <Button 
                    size="lg" 
                    className={`font-bold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl transition-all duration-300 w-full sm:w-auto hover:scale-110 active:scale-95 shadow-2xl hover:shadow-3xl touch-manipulation rounded-none hover-glow ${
                      currentSlideData.theme === 'dark'
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary'
                        : 'bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900'
                    }`}
                  >
                    {currentSlideData.primaryButton.text}
                  </Button>
                </Link>
                <Link href={currentSlideData.secondaryButton.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`border-2 font-bold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl transition-all duration-300 w-full sm:w-auto hover:scale-110 active:scale-95 backdrop-blur-sm touch-manipulation rounded-none ${
                      currentSlideData.theme === 'dark'
                        ? 'border-white text-white hover:bg-white hover:text-gray-900 bg-transparent hover:shadow-lg'
                        : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/90 hover:shadow-lg'
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
