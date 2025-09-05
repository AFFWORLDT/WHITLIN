"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download,
  ArrowLeft,
  Loader2,
  FileText,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package
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
    case "completed": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "cancelled": return "bg-red-100 text-red-800"
    case "processing": return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
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

export default function InvoicePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

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

  const handleDownloadInvoice = async () => {
    if (!order) return
    
    try {
      setDownloading(true)
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error('Please allow popups to download the invoice')
        return
      }

      // Generate HTML content for the invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice #${order.id} - KeraGold Pro</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
            .invoice-number { font-size: 16px; color: #6b7280; }
            .content { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .left-column, .right-column { width: 48%; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .section-content { color: #374151; line-height: 1.6; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .items-table th { background-color: #f9fafb; font-weight: bold; color: #1f2937; }
            .items-table .text-right { text-align: right; }
            .summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .summary-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-completed { background-color: #dcfce7; color: #166534; }
            .status-shipped { background-color: #dbeafe; color: #1e40af; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">KeraGold Pro</div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">Invoice #${order.id}</div>
          </div>

          <div class="content">
            <div class="left-column">
              <div class="section">
                <div class="section-title">Bill To:</div>
                <div class="section-content">
                  <strong>${order.customer.name}</strong><br>
                  ${order.customer.email}<br>
                  ${order.customer.phone || 'N/A'}
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Shipping Address:</div>
                <div class="section-content">
                  <strong>${order.shippingAddress.name}</strong><br>
                  ${order.shippingAddress.address}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                  ${order.shippingAddress.country}
                </div>
              </div>
            </div>

            <div class="right-column">
              <div class="section">
                <div class="section-title">Invoice Details:</div>
                <div class="section-content">
                  <strong>Invoice Date:</strong> ${order.date}<br>
                  <strong>Order Status:</strong> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span><br>
                  <strong>Payment Method:</strong> ${order.paymentMethod}<br>
                  <strong>Payment Status:</strong> <span class="status-badge status-${order.paymentStatus}">${order.paymentStatus.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">AED ${item.price.toFixed(2)}</td>
                  <td class="text-right">AED ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>AED ${order.subtotal.toFixed(2)}</span>
            </div>
            ${order.discount > 0 ? `
            <div class="summary-row">
              <span>Discount:</span>
              <span>-AED ${order.discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="summary-row">
              <span>Shipping:</span>
              <span>AED ${order.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>AED ${order.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>AED ${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>KeraGold Pro - Premium Hair Care Solutions</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
      
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice')
    } finally {
      setDownloading(false)
    }
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
                <p className="text-muted-foreground">Loading invoice...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || 'Failed to load invoice'}</p>
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
              <Link href={`/orders/${order.orderId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </Link>
              <Button 
                onClick={handleDownloadInvoice} 
                disabled={downloading}
                className="ml-auto"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {downloading ? 'Generating...' : 'Download Invoice'}
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 text-center">
                <div className="text-4xl font-bold mb-2">KeraGold Pro</div>
                <div className="text-2xl font-semibold mb-1">INVOICE</div>
                <div className="text-lg opacity-90">Invoice #{order.id}</div>
              </div>

              <div className="p-8">
                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Bill To
                    </h3>
                    <div className="space-y-1">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-1" />
                        {order.customer.email}
                      </p>
                      {order.customer.phone && (
                        <p className="flex items-center text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.customer.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Invoice Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invoice Date:</span>
                        <span className="font-medium">{order.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Status:</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status:</span>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
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

                {/* Items Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Items Ordered
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Item</th>
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                          <th className="text-right py-3 px-4 font-semibold">Qty</th>
                          <th className="text-right py-3 px-4 font-semibold">Price</th>
                          <th className="text-right py-3 px-4 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {item.description}
                            </td>
                            <td className="py-3 px-4 text-right">{item.quantity}</td>
                            <td className="py-3 px-4 text-right">AED {item.price.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              AED {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>AED {order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-AED {order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>AED {order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>AED {order.tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>AED {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Thank you for your business!</p>
                  <p>KeraGold Pro - Premium Hair Care Solutions</p>
                  <p className="text-sm mt-2">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
