import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Order from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Get user data
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get user's orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
    
    // Calculate stats
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const memberSince = user.createdAt.toISOString().split('T')[0]
    
    // Format orders
    const recentOrders = orders.map(order => ({
      id: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      total: order.totalAmount,
      status: order.status,
      items: order.items.length
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone || 'Not provided',
          joinDate: memberSince,
          totalOrders,
          totalSpent
        },
        recentOrders,
        wishlist: [], // TODO: Implement wishlist functionality
        addresses: [] // TODO: Implement address management
      }
    })
  } catch (error) {
    console.error('Error fetching user account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account data' },
      { status: 500 }
    )
  }
}
