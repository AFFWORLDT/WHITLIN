"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
  ArrowLeft,
  Package,
  Star,
  Eye
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  stock: number
  addedAt: string
}

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/wishlist?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Wishlist data received:', data.data)
          setWishlistItems(data.data)
        } else {
          setError(data.error || 'Failed to fetch wishlist')
          toast.error(data.error || 'Failed to fetch wishlist')
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err)
        setError('An unexpected error occurred while fetching wishlist')
        toast.error('An unexpected error occurred while fetching wishlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user, router])

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId))
      
      const response = await fetch(`/api/user/wishlist?userId=${user?.id}&productId=${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== productId))
        toast.success('Product removed from wishlist')
      } else {
        toast.error(data.error || 'Failed to remove product from wishlist')
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      toast.error('Failed to remove product from wishlist')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    // TODO: Implement add to cart functionality
    toast.success(`${item.name} added to cart`)
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your wishlist...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
                <Heart className="h-8 w-8 mr-3 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={removingItems.has(item.id)}
                        >
                          {removingItems.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {!item.inStock && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          AED {item.price.toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="capitalize">{item.category}</span>
                        <span>Stock: {item.stock}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/products/${item.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding products you love to your wishlist. They'll appear here for easy access.
                </p>
                <Link href="/">
                  <Button>
                    <Package className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {wishlistItems.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your wishlist items efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement add all to cart
                      toast.success('All items added to cart')
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement clear wishlist
                      if (confirm('Are you sure you want to clear your wishlist?')) {
                        setWishlistItems([])
                        toast.success('Wishlist cleared')
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Wishlist
                  </Button>
                  <Link href="/">
                    <Button variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
