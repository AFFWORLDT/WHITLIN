import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const requestBody = await request.json()
    console.log('Order API - Request body:', JSON.stringify(requestBody, null, 2))
    
    const {
      userId,
      items,
      subtotal,
      shipping,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod = 'cash_on_delivery',
      notes = ''
    } = requestBody
    
    console.log('Order API - Extracted data:', {
      userId,
      itemsCount: items?.length,
      shippingAddress,
      paymentMethod,
      notes
    })
    
    if (!userId || !items || !shippingAddress) {
      console.log('Order API - Missing required fields:', {
        hasUserId: !!userId,
        hasItems: !!items,
        hasShippingAddress: !!shippingAddress
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Optimized: Validate user and products in parallel
    const [user, products] = await Promise.all([
      User.findById(userId).select('_id name email').lean(),
      Product.find({ 
        _id: { $in: items.map(item => item.productId) } 
      }).select('_id name price stock image').lean()
    ])
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Create product map for faster lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]))
    
    // Validate products and calculate totals
    let calculatedSubtotal = 0
    let orderItems = []
    
    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }
      
      const itemTotal = product.price * item.quantity
      calculatedSubtotal += itemTotal
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        total: itemTotal
      })
    }
    
    // Calculate final totals
    const calculatedShipping = shipping || (calculatedSubtotal > 100 ? 0 : 10)
    const calculatedTax = tax || (calculatedSubtotal * 0.05)
    const calculatedTotal = (calculatedSubtotal + calculatedShipping + calculatedTax)
    
    // Transform shipping address to match Order model schema
    const transformedShippingAddress = {
      name: shippingAddress.name,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone
    }
    
    console.log('Order API - Transformed shipping address:', transformedShippingAddress)
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Create order
    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      subtotal: subtotal || calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      discount: 0,
      totalAmount: totalAmount || calculatedTotal,
      shippingAddress: transformedShippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      status: 'pending',
      priority: 'normal',
      source: 'website',
      notes,
      trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    })
    
    console.log('Order API - Order object before save:', {
      orderNumber: order.orderNumber,
      user: order.user,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      status: order.status
    })
    
    await order.save()
    
    // Optimized: Update product stock and user in parallel
    const stockUpdates = items.map(item => 
      Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      )
    )
    
    const userUpdate = User.findByIdAndUpdate(userId, {
      lastOrderDate: new Date()
    })
    
    await Promise.all([...stockUpdates, userUpdate])
    
    console.log('Order created successfully:', {
      orderNumber: order.orderNumber,
      userId,
      totalAmount: order.totalAmount,
      itemsCount: orderItems.length
    })
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        trackingNumber: order.trackingNumber
      },
      message: 'Order placed successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Order API - Error creating order:', error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Order API - Error message:', error.message)
      console.error('Order API - Error stack:', error.stack)
    }
    
    // Check if it's a validation error
    if (error && typeof error === 'object' && 'errors' in error) {
      console.error('Order API - Validation errors:', error.errors)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    let filter: any = {}
    
    if (userId) {
      filter.user = userId
    }
    
    if (status) {
      filter.status = status
    }
    
    const skip = (page - 1) * limit
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const totalOrders = await Order.countDocuments(filter)
    
    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page < Math.ceil(totalOrders / limit),
          hasPrev: page > 1
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}