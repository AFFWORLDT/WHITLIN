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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Best Sellers</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Our most loved products from every treatment range, trusted by professionals worldwide
          </p>
        </div>

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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {products.map((product) => {
              const badge = getProductBadge(product)
              const size = getProductSize(product)
              const productId = product._id || product.id
              
              return (
                <Card
                  key={productId}
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50"
                >
                  <Link href={`/products/${productId}`}>
                    <div className="relative aspect-square overflow-hidden cursor-pointer">
                      <MobileProductGridImage
                        src={product.image || product.images[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      {badge && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          {badge}
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {size}
                      </div>
                    </div>
                  </Link>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 4.8) ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.rating?.toFixed(1) || '4.8'})
                      </span>
                    </div>

                    <Link href={`/products/${productId}`}>
                      <h3 className="font-serif text-lg font-semibold mb-1 text-balance hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-primary font-medium mb-1">
                      {product.category?.name || 'General'} Range
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 text-pretty line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">AED {product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
