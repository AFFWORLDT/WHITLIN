"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Loader2,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Calendar,
  Navigation,
  RefreshCw
} from "lucide-react"
import { Header } from "@/components/header"
import { toast } from "sonner"
import Link from "next/link"

interface TrackingEvent {
  id: string
  status: string
  description: string
  location: string
  timestamp: string
  completed: boolean
}

interface OrderTracking {
  orderId: string
  orderNumber: string
  status: string
  trackingNumber: string
  estimatedDelivery: string
  actualDelivery: string | null
  carrier: string
  events: TrackingEvent[]
  currentLocation: string
  progress: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 border-green-200"
    case "shipped": return "bg-blue-100 text-blue-800 border-blue-200"
    case "in_transit": return "bg-blue-100 text-blue-800 border-blue-200"
    case "out_for_delivery": return "bg-orange-100 text-orange-800 border-orange-200"
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "processing": return "bg-purple-100 text-purple-800 border-purple-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getEventIcon = (status: string) => {
  switch (status) {
    case "order_placed": return <Package className="h-5 w-5" />
    case "processing": return <Clock className="h-5 w-5" />
    case "shipped": return <Truck className="h-5 w-5" />
    case "in_transit": return <Navigation className="h-5 w-5" />
    case "out_for_delivery": return <Truck className="h-5 w-5" />
    case "delivered": return <CheckCircle className="h-5 w-5" />
    default: return <Clock className="h-5 w-5" />
  }
}

const getEventColor = (completed: boolean) => {
  return completed 
    ? "bg-green-500 text-white" 
    : "bg-gray-200 text-gray-600"
}

// Mock tracking data - in real app this would come from shipping carrier API
const generateTrackingEvents = (orderStatus: string): TrackingEvent[] => {
  const baseEvents = [
    {
      id: "1",
      status: "order_placed",
      description: "Order placed successfully",
      location: "KeraGold Pro Warehouse",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    },
    {
      id: "2",
      status: "processing",
      description: "Order is being processed",
      location: "KeraGold Pro Warehouse",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    }
  ]

  if (orderStatus === "shipped" || orderStatus === "in_transit" || orderStatus === "out_for_delivery" || orderStatus === "completed") {
    baseEvents.push({
      id: "3",
      status: "shipped",
      description: "Package shipped from warehouse",
      location: "KeraGold Pro Warehouse",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    })
  }

  if (orderStatus === "in_transit" || orderStatus === "out_for_delivery" || orderStatus === "completed") {
    baseEvents.push({
      id: "4",
      status: "in_transit",
      description: "Package in transit",
      location: "Dubai Distribution Center",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    })
  }

  if (orderStatus === "out_for_delivery" || orderStatus === "completed") {
    baseEvents.push({
      id: "5",
      status: "out_for_delivery",
      description: "Package out for delivery",
      location: "Local Delivery Hub",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    })
  }

  if (orderStatus === "completed") {
    baseEvents.push({
      id: "6",
      status: "delivered",
      description: "Package delivered successfully",
      location: "Delivery Address",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed: true
    })
  }

  return baseEvents
}

export default function OrderTrackingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [tracking, setTracking] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchTrackingInfo = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders/${params.orderId}`)
        const data = await response.json()
        
        if (data.success) {
          const order = data.data
          
          // Generate tracking events based on order status
          const events = generateTrackingEvents(order.status)
          
          const trackingInfo: OrderTracking = {
            orderId: order.orderId,
            orderNumber: order.id,
            status: order.status,
            trackingNumber: order.trackingNumber || `TRK${order.id.replace('ORD-', '')}`,
            estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            actualDelivery: order.actualDelivery,
            carrier: "KeraGold Express",
            events: events,
            currentLocation: events[events.length - 1]?.location || "Processing Center",
            progress: events.filter(e => e.completed).length / events.length * 100
          }
          
          setTracking(trackingInfo)
        } else {
          setError(data.error || 'Failed to fetch tracking information')
          toast.error(data.error || 'Failed to fetch tracking information')
        }
      } catch (err) {
        console.error('Error fetching tracking info:', err)
        setError('An unexpected error occurred while fetching tracking information')
        toast.error('An unexpected error occurred while fetching tracking information')
      } finally {
        setLoading(false)
      }
    }

    if (params.orderId) {
      fetchTrackingInfo()
    }
  }, [user, router, params.orderId])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast.success('Tracking information updated')
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading tracking information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || 'Failed to load tracking information'}</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/orders/${tracking.orderId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </Link>
              <Button 
                onClick={handleRefresh} 
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {refreshing ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Track Your Package</h1>
              <p className="text-muted-foreground">Order #{tracking.orderNumber}</p>
            </div>
          </div>

          {/* Tracking Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Tracking Information
                  </CardTitle>
                  <CardDescription>
                    Tracking Number: {tracking.trackingNumber}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(tracking.status)} border`}>
                  {tracking.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(tracking.progress)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {tracking.carrier}
                  </div>
                  <div className="text-sm text-muted-foreground">Carrier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {tracking.actualDelivery ? 
                      new Date(tracking.actualDelivery).toLocaleDateString() : 
                      new Date(tracking.estimatedDelivery).toLocaleDateString()
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tracking.actualDelivery ? 'Delivered' : 'Estimated Delivery'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Order Progress</span>
                  <span>{Math.round(tracking.progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${tracking.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getEventColor(tracking.events[tracking.events.length - 1]?.completed || false)}`}>
                  {getEventIcon(tracking.events[tracking.events.length - 1]?.status || 'processing')}
                </div>
                <div>
                  <div className="font-medium">
                    {tracking.events[tracking.events.length - 1]?.description || 'Processing'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tracking.currentLocation}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Tracking Timeline
              </CardTitle>
              <CardDescription>
                Detailed tracking history for your package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tracking.events.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getEventColor(event.completed)}`}>
                      {getEventIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{event.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString()} at{' '}
                          {new Date(event.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {tracking.actualDelivery && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Package Delivered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">
                    Your package was delivered successfully!
                  </div>
                  <div className="text-muted-foreground">
                    Delivered on {new Date(tracking.actualDelivery).toLocaleDateString()} at{' '}
                    {new Date(tracking.actualDelivery).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
