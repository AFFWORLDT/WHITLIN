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
    description: "Transform your hair with our luxury keratin and hyaluronic acid treatments. Professional results, salon-quality care.",
    image: "/images/keragold-hero.png",
    primaryButton: {
      text: "Shop Now",
      href: "/products"
    },
    secondaryButton: {
      text: "View Collections",
      href: "/collections"
    },
    textPosition: 'center',
    theme: 'dark'
  },
  {
    id: "slide-2",
    title: "Range After DD Treatment",
    subtitle: "Premium Collection",
    description: "Discover our exclusive range designed specifically for post-treatment care. Nourish and protect your hair with our premium formulations.",
    image: "/images/post-treatment.jpeg",
    primaryButton: {
      text: "Explore Range",
      href: "/collections/dd-treatment"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    overlay: "KERAGOLD PRO",
    textPosition: 'left',
    theme: 'light'
  },
  {
    id: "slide-3",
    title: "Keratin Treatment",
    subtitle: "Professional Grade",
    description: "Experience the power of professional-grade keratin treatments. Smooth, shiny, and manageable hair that lasts for months.",
    image: "/images/keratin-straightening.jpeg",
    primaryButton: {
      text: "Shop Keratin",
      href: "/products?category=keratin"
    },
    secondaryButton: {
      text: "Book Consultation",
      href: "/contact"
    },
    textPosition: 'right',
    theme: 'dark'
  },
  {
    id: "slide-4",
    title: "Expert Liss System",
    subtitle: "Advanced Technology",
    description: "Revolutionary hair straightening system with advanced keratin technology. Achieve salon-perfect results at home.",
    image: "/images/expert-liss-system.jpeg",
    primaryButton: {
      text: "Shop Expert Liss",
      href: "/products?category=expert-liss"
    },
    secondaryButton: {
      text: "View Results",
      href: "/gallery"
    },
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
      className="relative h-[70vh] min-h-[500px] md:h-[80vh] md:min-h-[600px] lg:min-h-[700px] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
          priority={currentSlide === 0}
        />
        
        {/* Dynamic Overlay */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          currentSlideData.theme === 'dark' 
            ? 'bg-black/40' 
            : 'bg-white/20'
        }`} />
        
        {/* Brand Overlay */}
        {currentSlideData.overlay && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 rotate-90 hidden lg:block">
            <div className="text-white/10 text-6xl font-bold tracking-widest">
              {currentSlideData.overlay}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-2 md:p-3 transition-all duration-200 disabled:opacity-50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-2 md:p-3 transition-all duration-200 disabled:opacity-50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-2 transition-all duration-200"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`max-w-4xl ${
            currentSlideData.textPosition === 'left' 
              ? 'text-left' 
              : currentSlideData.textPosition === 'right'
              ? 'text-right ml-auto'
              : 'text-center mx-auto'
          }`}>
            {/* Title */}
            <h1 className={`font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-balance transition-all duration-700 transform ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            } ${
              currentSlideData.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {currentSlideData.title}
              <span className={`block ${
                currentSlideData.theme === 'dark' ? 'text-primary' : 'text-red-600'
              }`}>
                {currentSlideData.subtitle}
              </span>
            </h1>

            {/* Description */}
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-pretty max-w-2xl transition-all duration-700 transform delay-100 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            } ${
              currentSlideData.textPosition === 'center' ? 'mx-auto' : ''
            } ${
              currentSlideData.theme === 'dark' ? 'text-white/90' : 'text-gray-700'
            }`}>
              {currentSlideData.description}
            </p>

            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 transition-all duration-700 transform delay-200 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            } ${
              currentSlideData.textPosition === 'center' ? 'justify-center' : ''
            }`}>
              <Link href={currentSlideData.primaryButton.href}>
                <Button 
                  size="lg" 
                  className={`font-semibold px-6 md:px-8 py-2 md:py-3 text-sm md:text-base transition-all duration-200 w-full sm:w-auto ${
                    currentSlideData.theme === 'dark'
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {currentSlideData.primaryButton.text}
                </Button>
              </Link>
              <Link href={currentSlideData.secondaryButton.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className={`border-2 font-semibold px-6 md:px-8 py-2 md:py-3 text-sm md:text-base transition-all duration-200 w-full sm:w-auto ${
                    currentSlideData.theme === 'dark'
                      ? 'border-white text-white hover:bg-white hover:text-black bg-transparent'
                      : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent'
                  }`}
                >
                  {currentSlideData.secondaryButton.text}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 disabled:opacity-50 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${progress}%`
          }}
        />
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
