"use client"

import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { useProducts } from "@/hooks/use-products"
import { getProductSize, getProductBadge, type NormalizedProduct } from "@/lib/product-utils"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function BestSellers() {
  // Use stable URL - cache bypassing is handled by the API
  const { products, loading, error, refetch } = useProducts({
    url: '/api/products?limit=6&featured=true&noCache=true',
    fallbackToAll: true
  })
  const { addItem } = useCart()

  const handleAddToCart = (product: NormalizedProduct) => {
    const size = getProductSize(product)
    
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0] || "/placeholder.svg",
      size: size,
      range: product.category?.name || 'General',
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.03),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm font-medium">
                Featured Products
              </Badge>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Best Sellers
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Our most loved products from every collection, trusted by hotels and hospitality professionals worldwide
            </p>
          </div>
        </ScrollAnimate>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            <p className="mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" className="mt-4">Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No products available at the moment.</p>
            <p className="text-sm mb-4">Check back soon for our latest products!</p>
            <Button onClick={refetch} variant="outline">Refresh</Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product, index) => {
                  const badge = getProductBadge(product)
                  const size = getProductSize(product)
                  const productId = product._id || product.id
                  
                  return (
                    <CarouselItem key={productId} className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-border/50 hover-lift relative bg-white h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Link href={`/products/${productId}`}>
                          <div className="relative aspect-square overflow-hidden cursor-pointer">
                            <MobileProductGridImage
                              src={product.image || product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {badge && (
                              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                                {badge}
                              </Badge>
                            )}
                            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                              {size}
                            </div>
                          </div>
                        </Link>

                        <CardContent className="p-6 relative z-10 bg-white">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 transition-all duration-300 ${
                                  i < Math.floor(product.rating || 4.8) 
                                    ? "fill-amber-400 text-amber-400 group-hover:scale-110" 
                                    : "text-gray-300"
                                }`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1 font-medium">
                              ({product.rating?.toFixed(1) || '4.8'})
                            </span>
                          </div>

                          <Link href={`/products/${productId}`}>
                            <h3 className="font-serif text-lg font-semibold mb-2 text-balance hover:text-primary transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem]">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
                            {product.category?.name || 'General'} Range
                          </p>
                          <p className="text-sm text-gray-600 mb-4 text-pretty line-clamp-2 min-h-[2.5rem]">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex flex-col">
                              <span className="text-2xl font-bold text-gray-900">AED {product.price}</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs text-gray-500 line-through">
                                  AED {product.originalPrice}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary shadow-lg hover:shadow-xl" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-primary shadow-lg hover:shadow-xl" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  )
}
