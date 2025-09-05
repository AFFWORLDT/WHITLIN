"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Eye,
  Star
} from "lucide-react"

// Mock data - in real app this would come from API
const stats = {
  totalProducts: 45,
  totalOrders: 128,
  totalUsers: 89,
  totalRevenue: 12500,
  recentOrders: [
    { id: "ORD-001", customer: "John Doe", amount: 299.99, status: "completed", date: "2024-01-15" },
    { id: "ORD-002", customer: "Jane Smith", amount: 199.99, status: "pending", date: "2024-01-14" },
    { id: "ORD-003", customer: "Mike Johnson", amount: 399.99, status: "shipped", date: "2024-01-13" },
    { id: "ORD-004", customer: "Sarah Wilson", amount: 149.99, status: "completed", date: "2024-01-12" },
  ],
  topProducts: [
    { name: "KeraGold Expert Liss System", sales: 45, revenue: 4500 },
    { name: "KeraGold Inforcer Range", sales: 32, revenue: 3200 },
    { name: "KeraGold Nourishing System", sales: 28, revenue: 2800 },
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">AED {order.amount}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">AED {product.revenue}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Add Product</h3>
                    <p className="text-sm text-muted-foreground">Create a new product</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">View Analytics</h3>
                    <p className="text-sm text-muted-foreground">Check sales reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">User management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
