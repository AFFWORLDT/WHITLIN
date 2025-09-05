"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Package, 
  Settings, 
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  ShoppingBag,
  Star,
  Calendar
} from "lucide-react"

// Mock data - in real app this would come from API
const userData = {
  profile: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2024-01-10",
    totalOrders: 5,
    totalSpent: 1299.95
  },
  recentOrders: [
    { id: "ORD-001", date: "2024-01-15", total: 299.99, status: "completed", items: 2 },
    { id: "ORD-002", date: "2024-01-10", total: 199.99, status: "shipped", items: 1 },
    { id: "ORD-003", date: "2024-01-05", total: 399.99, status: "completed", items: 3 }
  ],
  wishlist: [
    { id: 1, name: "KeraGold Expert Liss System", price: 299.99, image: "/images/expert-liss-system.jpeg" },
    { id: 2, name: "KeraGold Inforcer Range", price: 199.99, image: "/images/inforcer-range.jpeg" }
  ],
  addresses: [
    { id: 1, type: "Home", address: "123 Main St, New York, NY 10001", isDefault: true },
    { id: 2, type: "Work", address: "456 Business Ave, New York, NY 10002", isDefault: false }
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your KeraGold Pro account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-lg font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="p-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userData.profile.totalOrders}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${userData.profile.totalSpent}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userData.profile.joinDate}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Your latest purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-muted-foreground">{order.date} • {order.items} items</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${order.total}</div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Orders
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>All your past and current orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-muted-foreground">{order.date} • {order.items} items</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${order.total}</div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "wishlist" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Wishlist</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.wishlist.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">${item.price}</div>
                          </div>
                          <Button size="sm">Add to Cart</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "addresses" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your shipping addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.addresses.map((address) => (
                        <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium flex items-center space-x-2">
                              <span>{address.type}</span>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{address.address}</div>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4">
                      Add New Address
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p className="text-sm text-muted-foreground">{user.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline">Edit Profile</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full">
                        Enable Two-Factor Authentication
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive updates about your orders</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Danger Zone</CardTitle>
                      <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" onClick={logout} className="w-full">
                        Sign Out
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
