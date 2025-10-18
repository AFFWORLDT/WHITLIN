"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Sparkles } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface SpotlightProduct {
  _id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  sku: string
  category: {
    name: string
  }
  attributes: Array<{
    name: string
    value: string
  }>
  isActive: boolean
  createdAt: string
  isNewProduct?: boolean
  isBestSeller?: boolean
}

export function InTheSpotlight() {
  const [products, setProducts] = useState<SpotlightProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchSpotlightProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=8')
        const data = await response.json()
        
        console.log('API Response:', data)
        
        if (data.success) {
          console.log('Products with images:', data.data.map(p => ({ name: p.name, images: p.images })))
          setProducts(data.data)
        } else {
          // Fallback to regular products if no featured products
          const fallbackResponse = await fetch('/api/products?limit=8&sort=newest')
          const fallbackData = await fallbackResponse.json()
          console.log('Fallback Response:', fallbackData)
          if (fallbackData.success) {
            console.log('Fallback Products with images:', fallbackData.data.map(p => ({ name: p.name, images: p.images })))
            setProducts(fallbackData.data)
          }
        }
      } catch (error) {
        console.error('Error fetching spotlight products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpotlightProducts()
  }, [])

  const handleAddToCart = (product: SpotlightProduct) => {
    const size = product.attributes?.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      size: size,
      range: product.category?.name || 'General',
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  const getProductBadge = (product: SpotlightProduct) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return "Sale"
    }
    if (product.isNewProduct) {
      return "New"
    }
    if (product.isBestSeller) {
      return "Best Seller"
    }
    return null
  }

  const getProductSize = (product: SpotlightProduct) => {
    return product.attributes?.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3))
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <div className="bg-white border border-gray-100 p-4 h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 w-1/2"></div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                    <div className="h-4 bg-gray-200 w-1/3"></div>
                    <div className="h-3 bg-gray-200 w-1/4"></div>
                    <div className="h-8 bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Compact Layout */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-sm font-bold text-gray-900 tracking-wider uppercase">
                IN THE SPOTLIGHT
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
          </div>
          
          <Link href="/products" className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium px-6 py-2 rounded-none transition-all duration-200"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Product Carousel - Compact Design */}
        <div className="relative">
          {/* Navigation Arrows */}
          {products.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 shadow-sm rounded-none"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 shadow-sm rounded-none"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

        {/* Product Grid - Mobile First Design */}
        <div className="overflow-hidden">
          <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
            {products.map((product, index) => (
              <div key={product._id} className="flex-shrink-0 w-60 md:w-72">
                  <Card className="group bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 rounded-none">
                    {/* Product Image - Compact */}
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-40 md:h-48 bg-gray-50 overflow-hidden cursor-pointer">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 240px, 288px"
                            priority={index < 2}
                            onError={(e) => {
                              console.error('Image failed to load for product:', product.name, 'URL:', product.images[0])
                              // Try to load a fallback image
                              const target = e.target as HTMLImageElement
                              target.src = '/images/placeholder.jpg'
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully for product:', product.name)
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center">
                              <div className="text-4xl text-gray-400 mb-2">💄</div>
                              <p className="text-gray-500 text-xs font-medium">KeraGold Pro</p>
                              <p className="text-gray-400 text-xs">Premium Hair Care</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Badge - Compact */}
                        {getProductBadge(product) && (
                          <Badge className="absolute top-2 left-2 bg-gray-800 text-white border-0 text-xs px-2 py-1 rounded-none">
                            {getProductBadge(product)}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <CardContent className="p-4">
                      {/* Brand - Compact */}
                      <div className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                        KeraGold Pro
                      </div>
                      
                      {/* Product Name - Compact */}
                      <Link href={`/products/${product._id}`}>
                        <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-gray-700 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Price - Compact */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          AED {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      {/* Rating - Compact */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < 4 ? "fill-gray-900 text-gray-900" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          4.8 (127)
                        </span>
                      </div>
                      
                      {/* Add to Cart Button - Compact */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm py-2 rounded-none transition-all duration-200"
                      >
                        BUY PRODUCT
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        {products.length > 4 && (
          <div className="flex justify-center mt-6 gap-1">
            {Array.from({ length: Math.max(1, products.length - 3) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-gray-900 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
