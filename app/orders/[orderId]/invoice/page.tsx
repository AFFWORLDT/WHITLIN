"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Package
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image: string
  total: number
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

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: string
  status: string
  notes: string
  trackingNumber: string
  createdAt: string
  updatedAt: string
}

export default function InvoicePage() {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.orderId as string

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders/${orderId}`)
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
        } else {
          setError(data.error || 'Failed to fetch order details')
          toast.error(data.error || 'Failed to fetch order details')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('An unexpected error occurred')
        toast.error('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank')
    if (printWindow && order) {
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #f59e0b; }
            .invoice-title { font-size: 20px; margin: 10px 0; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { border-bottom: 2px solid #f59e0b; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f59e0b; color: white; }
            .total { font-weight: bold; font-size: 18px; }
            .footer { margin-top: 30px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">KeraGold Pro</div>
            <div class="invoice-title">INVOICE</div>
            <div>Order #${order.orderNumber}</div>
          </div>
          
          <div class="invoice-details">
            <div>
              <strong>Bill To:</strong><br>
              ${order.user.name}<br>
              ${order.user.email}
            </div>
            <div>
              <strong>Invoice Date:</strong><br>
              ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Order Date:</strong><br>
              ${new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div class="section">
            <h3>Shipping Address</h3>
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}<br>
            Phone: ${order.shippingAddress.phone}
          </div>
          
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>AED ${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>AED ${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="total">
                  <td colspan="3">Total Amount</td>
                  <td>AED ${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="section">
            <h3>Payment Information</h3>
            <strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ').toUpperCase()}<br>
            <strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}<br>
            <strong>Tracking Number:</strong> ${order.trackingNumber}
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>KeraGold Pro - Premium Hair Care Products</p>
          </div>
        </body>
        </html>
      `
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invoice...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
              <p className="text-gray-600 mb-8">
                {error || "The invoice you're looking for doesn't exist."}
              </p>
              <Link href="/orders">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/orders/${order._id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-4">
            {/* Invoice Header */}
            <div className="text-center mb-8 border-b pb-8">
              <h1 className="text-4xl font-bold text-yellow-600 mb-2">KeraGold Pro</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">INVOICE</h2>
              <p className="text-gray-600">Premium Hair Care Products</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Bill To:</h3>
                <div className="space-y-1">
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {order.user.email}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Invoice Details:</h3>
                <div className="space-y-1">
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Invoice Date:</span>
                    <span className="ml-2">{formatDate(order.createdAt)}</span>
                  </p>
                  <p className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="font-medium">Order Number:</span>
                    <span className="ml-2">{order.orderNumber}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Items:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">AED {item.price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                          AED {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-yellow-50 font-bold">
                      <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
                        Total Amount:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-lg">
                        AED {order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Payment Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <Badge className={`ml-2 ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                  <p><span className="font-medium">Order Status:</span> 
                    <Badge className={`ml-2 ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Notes:</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 border-t">
              <p className="text-gray-600 mb-2">Thank you for your business!</p>
              <p className="text-sm text-gray-500">
                KeraGold Pro - Premium Hair Care Products
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}