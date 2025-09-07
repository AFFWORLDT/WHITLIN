"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, MapPin, Zap, Clock, Shield, CheckCircle, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [expressCheckout, setExpressCheckout] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
    phone: ''
  })
  const [notes, setNotes] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [orderProgress, setOrderProgress] = useState(0)

  // Memoized calculations for better performance
  const subtotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [state.items])

  const shipping = useMemo(() => {
    return subtotal > 100 ? 0 : 10 // Free shipping over AED 100
  }, [subtotal])

  const tax = useMemo(() => {
    return subtotal * 0.05 // 5% tax
  }, [subtotal])

  const total = useMemo(() => {
    return subtotal + shipping + tax
  }, [subtotal, shipping, tax])

  const canExpressCheckout = useMemo(() => {
    return true // Express checkout is always available for logged-in users
  }, [])

  const selectedAddress = useMemo(() => {
    if (selectedAddressId) {
      return savedAddresses.find(addr => addr._id === selectedAddressId)
    }
    return savedAddresses.find(addr => addr.isDefault) || savedAddresses[0] || null
  }, [savedAddresses, selectedAddressId])

  useEffect(() => {
    if (user?.name) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch(`/api/user/addresses?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          // Remove duplicates based on address content
          const uniqueAddresses = data.data.filter((addr: any, index: number, self: any[]) => 
            index === self.findIndex((a: any) => 
              a.address === addr.address && 
              a.city === addr.city && 
              a.zipCode === addr.zipCode
            )
          )
          
          setSavedAddresses(uniqueAddresses)
          
          // Set default address if available
          const defaultAddress = uniqueAddresses.find((addr: any) => addr.isDefault) || uniqueAddresses[0]
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id)
            
            // Pre-fill form with default address
            setShippingAddress({
              name: defaultAddress.name,
              address: defaultAddress.address,
              city: defaultAddress.city,
              state: defaultAddress.state,
              zipCode: defaultAddress.zipCode,
              country: defaultAddress.country,
              phone: '' // Phone not saved in address
            })
          }
        }
      } catch (err) {
        console.error('Error fetching saved addresses:', err)
      }
    }

    fetchSavedAddresses()
  }, [user])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setShowCheckout(true)
  }

  const handleGuestCheckout = () => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    router.push('/checkout/guest')
  }

  // Super fast express checkout
  const handleExpressCheckout = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to place order")
      return
    }

    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setExpressCheckout(true)
    setOrderProgress(0)

    try {
      // Step 1: Validate and use saved address
      setOrderProgress(25)
      let finalAddress = shippingAddress

      if (selectedAddress) {
        // Use selected address if available
        finalAddress = {
          name: selectedAddress.name,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phone: (user as any).phone || ''
        }
      } else if (shippingAddress.name && shippingAddress.address && shippingAddress.city) {
        // Use current form address if filled
        finalAddress = shippingAddress
      } else {
        // Use default address from user profile or create minimal address
        finalAddress = {
          name: user.name || (user as any).firstName || 'Customer',
          address: 'Address to be confirmed',
          city: 'City to be confirmed',
          state: 'State to be confirmed',
          zipCode: '000000',
          country: 'India',
          phone: (user as any).phone || '0000000000'
        }
        
        toast.info("Order placed! We'll contact you for address confirmation.")
      }

      // Step 2: Create order data
      setOrderProgress(50)
      const orderData = {
        userId: user.id,
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        totalAmount: total,
        shippingAddress: finalAddress,
        paymentMethod: 'cash_on_delivery',
        notes: 'Express Checkout'
      }

      // Step 3: Place order
      setOrderProgress(75)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.success) {
        setOrderProgress(100)
        toast.success("🚀 Order placed in seconds! Thank you!")
        clearCart()
        setTimeout(() => {
          router.push(`/orders/${data.data.orderId}`)
        }, 500)
      } else {
        throw new Error(data.error || "Failed to place order")
      }
    } catch (error) {
      console.error('Express checkout error:', error)
      toast.error("Express checkout failed. Please try again.")
    } finally {
      setExpressCheckout(false)
      setOrderProgress(0)
    }
  }, [user, state.items, shippingAddress, selectedAddress, clearCart, router])

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place order")
      return
    }

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
      toast.error("Please fill in all shipping address fields")
      return
    }

    setPlacingOrder(true)
    setOrderProgress(0)

    try {
      // Step 1: Save address
      setOrderProgress(20)
      if (!selectedAddress || 
          selectedAddress.address !== shippingAddress.address ||
          selectedAddress.city !== shippingAddress.city ||
          selectedAddress.state !== shippingAddress.state ||
          selectedAddress.zipCode !== shippingAddress.zipCode) {
        
        try {
          await fetch(`/api/user/addresses?userId=${user.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: 'Home',
              name: shippingAddress.name,
              address: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zipCode: shippingAddress.zipCode,
              country: shippingAddress.country
            })
          })
        } catch (err) {
          console.error('Error saving address:', err)
          // Continue with order even if address saving fails
        }
      }

      // Step 2: Prepare order data
      setOrderProgress(50)
      const orderData = {
        userId: user.id,
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        totalAmount: total,
        shippingAddress,
        paymentMethod: 'cash_on_delivery',
        notes
      }

      // Step 3: Place order
      setOrderProgress(80)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.success) {
        setOrderProgress(100)
        toast.success("Order placed successfully!")
        clearCart()
        setTimeout(() => {
          router.push(`/orders/${data.data.orderId}`)
        }, 500)
      } else {
        console.error('Cart - Order failed:', data.error, data.details)
        toast.error(data.error || "Failed to place order")
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error("Failed to place order")
    } finally {
      setPlacingOrder(false)
      setOrderProgress(0)
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.success("Cart cleared")
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Cart Items ({state.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">AED {item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={loading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          AED {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Free' : `AED ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>AED {tax.toFixed(2)}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      <Shield className="h-3 w-3 inline mr-1" />
                      Free shipping on orders over AED 100
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                  
                  {!showCheckout ? (
                    <div className="space-y-3">
                      {user ? (
                        <>
                          {/* Express Checkout Button - Only for logged in users */}
                          <Button 
                            onClick={handleExpressCheckout}
                            disabled={expressCheckout || !canExpressCheckout}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                            size="lg"
                          >
                            {expressCheckout ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Express Checkout...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Zap className="h-5 w-5 mr-2" />
                                Express Checkout
                              </div>
                            )}
                          </Button>
                          
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {selectedAddress ? `Using: ${selectedAddress.name}` : 'Address confirmation required'}
                            </Badge>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleCheckout}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            size="lg"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Regular Checkout
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* Guest Checkout - For non-logged in users */}
                          <Button 
                            onClick={handleGuestCheckout}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                            size="lg"
                          >
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2" />
                              Continue as Guest
                            </div>
                          </Button>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">
                              No account needed • We'll create one for you
                            </p>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => router.push('/login')}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            size="lg"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Sign In to Checkout
                          </Button>
                        </>
                      )}
                      
                      {/* Trust Signals */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
                          <Shield className="h-3 w-3 mr-1" />
                          Secure
                        </div>
                        <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
                          <Clock className="h-3 w-3 mr-1" />
                          Fast Delivery
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      {(placingOrder || expressCheckout) && orderProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing Order...</span>
                            <span>{orderProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${orderProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <Truck className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Cash on Delivery Available</p>
                      </div>
                      
                      <Button 
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        {placingOrder ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Placing Order...
                          </div>
                        ) : (
                          'Place Order (Cash on Delivery)'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Selector */}
              {showCheckout && savedAddresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Saved Addresses
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddressSelector(!showAddressSelector)}
                      >
                        {showAddressSelector ? 'Hide' : 'Change'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showAddressSelector && (
                    <CardContent className="space-y-3">
                      {savedAddresses.map((address, index) => (
                        <div
                          key={`${address._id}-${index}-${address.address}-${address.city}`}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedAddressId(address._id)
                            setShippingAddress({
                              name: address.name,
                              address: address.address,
                              city: address.city,
                              state: address.state,
                              zipCode: address.zipCode,
                              country: address.country,
                              phone: ''
                            })
                            setShowAddressSelector(false)
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{address.name}</div>
                              <div className="text-sm text-gray-600">
                                {address.address}, {address.city}, {address.state} {address.zipCode}
                              </div>
                              <div className="text-xs text-gray-500">{address.country}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                              {selectedAddressId === address._id && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Shipping Address Form */}
              {showCheckout && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {savedAddresses.length > 0 ? 'Edit Address' : 'Shipping Address'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          placeholder="ZIP Code"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for your order"
                        rows={2}
                      />
                    </div>

                    {/* Save Address Option */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Save this address</div>
                        <div className="text-xs text-gray-600">Save for future orders</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!user?.id) return
                          try {
                            const response = await fetch(`/api/user/addresses`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                userId: user.id,
                                addressData: {
                                  type: 'Home',
                                  name: shippingAddress.name,
                                  address: shippingAddress.address,
                                  city: shippingAddress.city,
                                  state: shippingAddress.state,
                                  zipCode: shippingAddress.zipCode,
                                  country: shippingAddress.country,
                                  isDefault: savedAddresses.length === 0 // Set as default if first address
                                }
                              })
                            })
                            
                            if (response.ok) {
                              toast.success('Address saved successfully!')
                              // Refresh addresses
                              const data = await response.json()
                              if (data.success) {
                                setSavedAddresses(prev => {
                                  // Check if address already exists to avoid duplicates
                                  const exists = prev.some(addr => 
                                    addr.address === data.data.address && 
                                    addr.city === data.data.city && 
                                    addr.zipCode === data.data.zipCode
                                  )
                                  if (exists) {
                                    return prev // Don't add duplicate
                                  }
                                  return [...prev, data.data]
                                })
                                if (savedAddresses.length === 0) {
                                  setSelectedAddressId(data.data._id)
                                }
                              }
                            } else {
                              const errorData = await response.json()
                              toast.error(errorData.error || 'Failed to save address')
                            }
                          } catch (error) {
                            toast.error('Failed to save address')
                          }
                        }}
                        disabled={!shippingAddress.name || !shippingAddress.address || !shippingAddress.city}
                      >
                        Save Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}