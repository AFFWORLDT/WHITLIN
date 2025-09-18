"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UniversalProductImage, UniversalProductThumbnail } from "@/components/ui/universal-image"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  longDescription?: string
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
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('An unexpected error occurred while fetching product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product) return

      try {
        const response = await fetch(`/api/user/wishlist?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Wishlist data for status check:', data.data)
          const isInWishlist = data.data.some((item: any) => item.id === product._id)
          console.log('Is product in wishlist:', isInWishlist)
          setIsInWishlist(isInWishlist)
        }
      } catch (err) {
        console.error('Error checking wishlist status:', err)
      }
    }

    checkWishlistStatus()
  }, [user, product])

  const handleAddToCart = () => {
    if (!product) {
      console.log('No product found')
      return
    }

    console.log('Adding to cart:', {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity
    })

    const size = product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    // Optimized: Add all items at once instead of loop
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
      size: size,
      range: product.category.name,
      quantity: quantity // Pass quantity directly
    })
    
    toast.success(`${quantity}x ${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!product) {
      console.log('No product found')
      return
    }

    console.log('Buy now clicked:', {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity
    })

    const size = product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    // Add to cart first
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
      size: size,
      range: product.category.name,
      quantity: quantity
    })
    
    // Show success message
    toast.success(`${quantity}x ${product.name} added to cart! Redirecting to checkout...`)
    
    // Redirect to checkout after a short delay
    setTimeout(() => {
      router.push('/cart')
    }, 1000)
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist")
      return
    }

    if (!product) return

    try {
      setAddingToWishlist(true)
      
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('Product added to wishlist successfully')
        setIsInWishlist(true)
        toast.success(`${product.name} added to wishlist!`)
      } else {
        console.log('Failed to add to wishlist:', data.error)
        toast.error(data.error || 'Failed to add to wishlist')
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err)
      toast.error('Failed to add to wishlist')
    } finally {
      setAddingToWishlist(false)
    }
  }

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Product shared successfully!")
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      }
    } catch (err) {
      console.error('Error sharing:', err)
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      } catch (clipboardErr) {
        toast.error("Failed to share product")
      }
    }
  }

  const getProductAttribute = (name: string) => {
    return product?.attributes.find(attr => attr.name.toLowerCase() === name.toLowerCase())?.value || 'N/A'
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <UniversalProductImage
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  priority={true}
                  quality={85}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-6xl text-gray-400 mb-2">📦</div>
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <UniversalProductThumbnail
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {product.category.name}
                </Badge>
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              
              <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.8) 124 reviews</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold">AED {product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">AED {product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-100 text-red-800">
                    Save AED {product.originalPrice - product.price}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{getProductAttribute('size')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium">{getProductAttribute('color')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{getProductAttribute('weight')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{product.sku || 'N/A'}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  ⚡ Buy Now
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist || isInWishlist}
              >
                {addingToWishlist ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                )}
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over AED 200</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}