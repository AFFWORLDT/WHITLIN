"use client"

import { useState, useCallback } from "react"
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
  sm: { container: "w-8 h-8", text: "text-base" },
  md: { container: "w-12 h-12 sm:w-14 sm:h-14", text: "text-lg sm:text-xl" },
  lg: { container: "w-16 h-16 sm:w-20 sm:h-20", text: "text-xl sm:text-2xl" }
}

const logoPaths = [
  "/images/logonew.png",
  "/images/logo.png",
  "/placeholder-logo.png"
]

export function Logo({ showText = true, size = "md", href = "/", className = "", text = "Whitlin", subtext = "" }: LogoProps) {
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
      // All images failed, show text fallback
      setImageError(true)
    }
  }, [currentIndex])

  const sizes = sizeMap[size]
  const logoContent = (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className={`relative ${sizes.container} flex-shrink-0`}>
        {!imageError ? (
          <img
            key={`${imageSrc}-${currentIndex}`}
            src={imageSrc}
            alt={`${text} ${subtext} Logo`}
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
      {showText && (
        <div className="hidden sm:block">
          <span className={`font-serif ${sizes.text} font-bold`}>{text}</span>
          {subtext && <span className="text-xs text-muted-foreground block -mt-1">{subtext}</span>}
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

