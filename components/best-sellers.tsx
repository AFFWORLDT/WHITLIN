"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

const products = [
  {
    id: 1,
    name: "Post-Treatment Shampoo DD",
    price: 45,
    originalPrice: 55,
    rating: 4.8,
    reviews: 124,
    image: "/images/post-treatment.jpeg",
    badge: "Best Seller",
    description: "Keratin & Hyaluronic Acid - Sulfate Free",
    range: "Post-Treatment",
    size: "1000ml",
  },
  {
    id: 2,
    name: "Expert-Liss Mask XL",
    price: 65,
    rating: 4.9,
    reviews: 89,
    image: "/images/expert-liss-system.jpeg",
    badge: "New",
    description: "Keratin & Silk Protein - Anti-Frizz",
    range: "Expert-Liss",
    size: "500ml",
  },
  {
    id: 3,
    name: "Regenerating Serum AB",
    price: 38,
    rating: 4.7,
    reviews: 156,
    image: "/images/regenerating-system.jpeg",
    description: "Keratin & Garlic Extract - Damage Repair",
    range: "Regenerating",
    size: "100ml",
  },
  {
    id: 4,
    name: "Nourishing Mask BC",
    price: 52,
    rating: 4.8,
    reviews: 203,
    image: "/images/nourishing-system.jpeg",
    badge: "Popular",
    description: "Keratin & Coconut Oil - Deep Hydration",
    range: "Nourishing",
    size: "1000ml",
  },
  {
    id: 5,
    name: "Restructuring Shampoo CC",
    price: 42,
    rating: 4.6,
    reviews: 167,
    image: "/images/restructuring-system.jpeg",
    description: "Keratin & Castor Oil - Hair Discipline",
    range: "Restructuring",
    size: "500ml",
  },
  {
    id: 6,
    name: "Repair System AC",
    price: 78,
    originalPrice: 95,
    rating: 4.9,
    reviews: 142,
    image: "/images/repair-range.jpeg",
    badge: "Complete Set",
    description: "Hyaluronic Acid & Amla Oil - Full Treatment",
    range: "Repair",
    size: "Kit",
  },
]

export function BestSellers() {
  const { addItem } = useCart()

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      range: product.range,
    })
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{product.badge}</Badge>
                )}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {product.size}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({product.reviews})</span>
                </div>

                <h3 className="font-serif text-lg font-semibold mb-1 text-balance">{product.name}</h3>
                <p className="text-xs text-primary font-medium mb-1">{product.range} Range</p>
                <p className="text-sm text-muted-foreground mb-3 text-pretty">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
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
      </div>
    </section>
  )
}
