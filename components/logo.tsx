"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  text?: string
  subtext?: string
}

const sizeMap = {
  sm: { container: "w-8 h-8 sm:w-10 sm:h-10", text: "text-sm sm:text-base" },
  md: { container: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16", text: "text-base sm:text-lg md:text-xl" },
  lg: { container: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24", text: "text-lg sm:text-xl md:text-2xl" }
}

export function Logo({ showText = true, size = "md", href = "/", className = "", text = "KeraGold", subtext = "PRO" }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState("/images/logonew.png")
  const [isLoaded, setIsLoaded] = useState(false)

  // Preload the logo image on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const preloadImage = (src: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new window.Image()
        img.src = src
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
      })
    }

    // Try to preload logonew.png first
    preloadImage("/images/logonew.png").then((success) => {
      if (success) {
        setIsLoaded(true)
      } else {
        // Try fallback logo.png
        preloadImage("/images/logo.png").then((fallbackSuccess) => {
          if (fallbackSuccess) {
            setImageSrc("/images/logo.png")
            setIsLoaded(true)
          } else {
            // Try placeholder
            preloadImage("/placeholder-logo.png").then((placeholderSuccess) => {
              if (placeholderSuccess) {
                setImageSrc("/placeholder-logo.png")
                setIsLoaded(true)
              } else {
                setImageError(true)
                setIsLoaded(true)
              }
            })
          }
        })
      }
    })
  }, [])

  const handleImageError = () => {
    if (!imageError) {
      // Try fallback paths
      if (imageSrc === "/images/logonew.png") {
        setImageSrc("/images/logo.png")
      } else if (imageSrc === "/images/logo.png") {
        setImageSrc("/placeholder-logo.png")
      } else {
        setImageError(true)
      }
    }
  }

  const sizes = sizeMap[size]
  const logoContent = (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className={`relative ${sizes.container} flex-shrink-0`} style={{ minWidth: '100%', minHeight: '100%' }}>
        {!imageError ? (
          <>
            <Image
              src={imageSrc}
              alt="KeraGold PRO Logo"
              fill
              className={`object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              priority
              sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, (max-width: 1024px) 64px, 80px"
              quality={90}
              onError={handleImageError}
              onLoad={() => setIsLoaded(true)}
              unoptimized={false}
              style={{ 
                objectFit: 'contain',
                width: '100%',
                height: '100%'
              }}
            />
            {!isLoaded && (
              <div className={`absolute inset-0 bg-gray-100 animate-pulse rounded flex items-center justify-center ${sizes.container}`}>
                <span className="text-gray-400 text-xs">KG</span>
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-primary/10 rounded flex items-center justify-center ${sizes.container} border border-primary/20`}>
            <span className="font-serif font-bold text-primary text-xs sm:text-sm">KG</span>
          </div>
        )}
      </div>
      {showText && (
        <div className="hidden sm:block">
          <span className={`font-serif ${sizes.text} font-bold`}>{text}</span>
          {subtext && <span className="text-xs sm:text-sm text-muted-foreground block -mt-1">{subtext}</span>}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

