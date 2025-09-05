import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB()
    
    const { orderId } = params
    
    // Get order with populated product details and customer info
    const order = await Order.findById(orderId)
      .populate({
        path: 'items.product',
        select: 'name price image description category'
      })
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .lean()
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Format order for frontend
    const formattedOrder = {
      id: order.orderNumber,
      orderId: order._id,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount || 0,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item: any) => ({
        id: item.product?._id,
        name: item.product?.name || 'Product not found',
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        image: item.product?.image || '/placeholder.svg',
        description: item.product?.description || '',
        category: item.product?.category || ''
      })),
      shippingAddress: {
        name: order.shippingAddress?.name || order.customer?.name,
        address: order.shippingAddress?.address || 'Address not provided',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        zipCode: order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || '',
        phone: order.shippingAddress?.phone || order.customer?.phone || ''
      },
      billingAddress: order.billingAddress || order.shippingAddress,
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null,
      actualDelivery: order.actualDelivery || null,
      notes: order.notes || '',
      customer: {
        name: order.customer?.name,
        email: order.customer?.email,
        phone: order.customer?.phone
      }
    }
    
    return NextResponse.json({
      success: true,
      data: formattedOrder
    })
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
