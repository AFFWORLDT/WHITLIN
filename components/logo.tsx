"use client"

import { useState, useCallback } from "react"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

const sizeMap = {
  sm: { container: "w-8 h-8" },
  md: { container: "w-12 h-12 sm:w-14 sm:h-14" },
  lg: { container: "w-16 h-16 sm:w-20 sm:h-20" }
}

const logoPaths = [
  "/whitelin-logo.png",
  "/images/logonew.png",
  "/images/logo.png",
  "/placeholder-logo.png"
]

export function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const [imageSrc, setImageSrc] = useState(logoPaths[0])
  const [imageError, setImageError] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleImageError = useCallback(() => {
    const nextIndex = currentIndex + 1
    
    if (nextIndex < logoPaths.length) {
      // Try next fallback image
      setCurrentIndex(nextIndex)
      setImageSrc(logoPaths[nextIndex])
      setImageError(false)
    } else {
      // All images failed
      setImageError(true)
    }
  }, [currentIndex])

  const sizes = sizeMap[size]
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizes.container} flex-shrink-0`}>
        {!imageError ? (
          <img
            key={`${imageSrc}-${currentIndex}`}
            src={imageSrc}
            alt="Whitlin Logo"
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="eager"
          />
        ) : (
          <div className={`w-full h-full bg-primary/10 rounded flex items-center justify-center ${sizes.container}`}>
            <span className="font-serif font-bold text-primary">W</span>
          </div>
        )}
      </div>
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

