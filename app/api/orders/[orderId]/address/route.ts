import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB()
    
    const { orderId } = params
    const body = await request.json()
    
    const { name, address, city, state, zipCode, country, phone } = body
    
    // Validate required fields
    if (!name || !address || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { success: false, error: 'All address fields are required' },
        { status: 400 }
      )
    }
    
    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: orderId },
      {
        $set: {
          'shippingAddress.name': name,
          'shippingAddress.address': address,
          'shippingAddress.city': city,
          'shippingAddress.state': state,
          'shippingAddress.zipCode': zipCode,
          'shippingAddress.country': country,
          'shippingAddress.phone': phone || '',
          updatedAt: new Date()
        }
      },
      { new: true }
    )
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        orderId: updatedOrder._id,
        shippingAddress: updatedOrder.shippingAddress
      }
    })
    
  } catch (error) {
    console.error('Error updating order address:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
