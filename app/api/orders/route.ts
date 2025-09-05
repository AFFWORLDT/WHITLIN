import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    
    // Build query
    let query: any = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (customerId) {
      query.customer = customerId
    }
    
    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: orders
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { customer, items, shippingAddress, paymentMethod } = body
    
    // Validate required fields
    if (!customer || !items || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Customer, items, and shipping address are required' },
        { status: 400 }
      )
    }
    
    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`
    
    // Create new order
    const order = new Order({
      orderNumber,
      customer,
      items,
      total,
      status: 'pending',
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe'
    })
    
    await order.save()
    
    // Populate the order with customer and product details
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .lean()
    
    return NextResponse.json({
      success: true,
      data: populatedOrder
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}