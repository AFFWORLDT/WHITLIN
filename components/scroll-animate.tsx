"use client"

import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface ScrollAnimateProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-in'
  delay?: number
  threshold?: number
}

export function ScrollAnimate({ 
  children, 
  className = '', 
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1
}: ScrollAnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true })

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? 'animate' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

