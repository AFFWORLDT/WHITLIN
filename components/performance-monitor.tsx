"use client"

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint (FCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime + 'ms')
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime + 'ms')
        }
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('CLS:', clsValue)
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        observer.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return null
}

// Preload critical resources
export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical images (only if they exist)
    const criticalImages = [
      '/images/logo.png',
      '/images/keragold-hero.png'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.onerror = () => {
        console.warn(`Image preload failed: ${src}`)
        document.head.removeChild(link)
      }
      document.head.appendChild(link)
    })

    // Preload critical fonts (only if they exist)
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    fontLink.href = '/fonts/inter-var.woff2'
    fontLink.onerror = () => {
      console.warn('Font file not found, skipping preload')
      document.head.removeChild(fontLink)
    }
    document.head.appendChild(fontLink)
  }, [])

  return null
}

// Image optimization hook
export function useImageOptimization() {
  const optimizeImage = (src: string, width?: number, height?: number) => {
    if (typeof window === 'undefined') return src
    
    // Add WebP support check
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0

    const format = supportsWebP ? 'webp' : 'jpeg'
    const params = new URLSearchParams()
    
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('f', format)
    params.set('q', '80') // Quality

    return `${src}?${params.toString()}`
  }

  return { optimizeImage }
}
