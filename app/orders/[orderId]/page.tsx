"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Download,
  Calendar,
  MapPin,
  Loader2,
  RotateCcw,
  ArrowLeft,
  CreditCard,
  User,
  Phone,
  Mail,
  Building,
  FileText
} from "lucide-react"
import { Header } from "@/components/header"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
  image: string
  description: string
  category: string
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface OrderDetails {
  id: string
  orderId: string
  date: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  paymentMethod: string
  paymentStatus: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  trackingNumber: string | null
  estimatedDelivery: string | null
  actualDelivery: string | null
  notes: string
  customer: {
    name: string
    email: string
    phone: string
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 border-green-200"
    case "shipped": return "bg-blue-100 text-blue-800 border-blue-200"
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "cancelled": return "bg-red-100 text-red-800 border-red-200"
    case "processing": return "bg-purple-100 text-purple-800 border-purple-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "shipped": return <Truck className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    case "processing": return <Package className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "failed": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function OrderDetailsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders/${params.orderId}`)
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
        } else {
          setError(data.error || 'Failed to fetch order details')
          toast.error(data.error || 'Failed to fetch order details')
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError('An unexpected error occurred while fetching order details')
        toast.error('An unexpected error occurred while fetching order details')
      } finally {
        setLoading(false)
      }
    }

    if (params.orderId) {
      fetchOrderDetails()
    }
  }, [user, router, params.orderId])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || 'Failed to load order details'}</p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Retry
                  </button>
                  <Link href="/orders">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Orders
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/orders">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
                <p className="text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Placed on {order.date}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-2">AED {order.total.toFixed(2)}</div>
                <Badge className={`${getStatusColor(order.status)} border`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Items
                  </CardTitle>
                  <CardDescription>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-lg mb-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span>AED {item.price.toFixed(2)} each</span>
                              </div>
                              <div className="font-medium">
                                AED {(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Shipping Address
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p className="flex items-center mt-2">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div>
                      <h4 className="font-medium mb-2">Tracking Information</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-muted-foreground">
                            Estimated delivery: {order.estimatedDelivery}
                          </p>
                        )}
                        {order.actualDelivery && (
                          <p className="text-sm text-muted-foreground">
                            Delivered on: {order.actualDelivery}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-AED {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>AED {order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>AED {order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/orders/${order.orderId}/invoice`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </Link>
                  
                  {order.trackingNumber && (
                    <Link href={`/orders/${order.orderId}/track`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    </Link>
                  )}
                  
                  {order.status === "completed" && (
                    <Button variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reorder Items
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
