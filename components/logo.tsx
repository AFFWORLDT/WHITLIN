"use client"

import { useState } from "react"
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
  sm: { container: "w-8 h-8", text: "text-base" },
  md: { container: "w-12 h-12 sm:w-14 sm:h-14", text: "text-lg sm:text-xl" },
  lg: { container: "w-16 h-16 sm:w-20 sm:h-20", text: "text-xl sm:text-2xl" }
}

export function Logo({ showText = true, size = "md", href = "/", className = "", text = "KeraGold", subtext = "PRO" }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState("/images/logonew.png")

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
      <div className={`relative ${sizes.container} flex-shrink-0`}>
        {!imageError ? (
          <Image
            src={imageSrc}
            alt="KeraGold PRO Logo"
            fill
            className="object-contain"
            priority
            onError={handleImageError}
            unoptimized={false}
          />
        ) : (
          <div className={`w-full h-full bg-primary/10 rounded flex items-center justify-center ${sizes.container}`}>
            <span className="font-serif font-bold text-primary">KG</span>
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

