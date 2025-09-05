"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: {
    name: string
  }
  attributes: Array<{
    name: string
    value: string
  }>
  isActive: boolean
  createdAt: string
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=6&featured=true')
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('An unexpected error occurred while fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    const size = product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      size: size,
      range: product.category.name,
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  const getProductSize = (product: Product) => {
    return product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
  }

  const getProductBadge = (product: Product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return "Sale"
    }
    return "Best Seller"
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
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No products available at the moment.</p>
            <p className="text-sm">Check back soon for our latest products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <Card
                key={product._id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50"
              >
                <Link href={`/products/${product._id}`}>
                  <div className="relative aspect-square overflow-hidden cursor-pointer">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {getProductBadge(product)}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      {getProductSize(product)}
                    </div>
                  </div>
                </Link>

                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                  </div>

                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-serif text-lg font-semibold mb-1 text-balance hover:text-primary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-primary font-medium mb-1">{product.category.name} Range</p>
                  <p className="text-sm text-muted-foreground mb-3 text-pretty line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">AED {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">AED {product.originalPrice}</span>
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
