"use client"

import { useEffect, useState } from 'react'

export function MobileOptimizer() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    // Add mobile-specific optimizations
    if (isMobile) {
      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      }

      // Add touch-friendly styles
      document.body.classList.add('mobile-optimized')
    } else {
      document.body.classList.remove('mobile-optimized')
    }

    // Add touch-friendly styles for touch devices
    if (isTouch) {
      document.body.classList.add('touch-device')
    } else {
      document.body.classList.remove('touch-device')
    }
  }, [isMobile, isTouch])

  return null
}

// Hook for mobile detection
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook for touch detection
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

// Mobile-friendly button component
export function MobileButton({ 
  children, 
  className = "", 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isMobile = useMobile()
  
  return (
    <button
      className={`${isMobile ? 'min-h-[44px] min-w-[44px]' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
