"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Eye,
  Download,
  Calendar,
  MapPin
} from "lucide-react"
import { Header } from "@/components/header"

// Mock data - in real app this would come from API
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "completed",
    total: 299.99,
    items: [
      { name: "KeraGold Expert Liss System", quantity: 1, price: 299.99 }
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18"
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 199.99,
    items: [
      { name: "KeraGold Inforcer Range", quantity: 1, price: 199.99 }
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-16"
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "pending",
    total: 399.99,
    items: [
      { name: "KeraGold Nourishing System", quantity: 1, price: 249.99 },
      { name: "KeraGold Repair Range", quantity: 1, price: 149.99 }
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: null,
    estimatedDelivery: "2024-01-20"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "cancelled": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "shipped": return <Truck className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Placed on {order.date}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${order.total}</div>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span>{item.name}</span>
                            </div>
                            <div className="text-right">
                              <div>Qty: {item.quantity}</div>
                              <div className="font-medium">${item.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Shipping Address
                        </h4>
                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                      </div>
                      
                      {order.trackingNumber && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            Tracking Information
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Tracking #: {order.trackingNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estimated delivery: {order.estimatedDelivery}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {order.trackingNumber && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                      
                      {order.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button>Start Shopping</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
