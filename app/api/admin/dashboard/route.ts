import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get current date and previous month for comparison
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all data in parallel
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      topProducts,
      lastMonthProducts,
      lastMonthOrders,
      lastMonthUsers,
      lastMonthRevenue,
      thisMonthRevenue
    ] = await Promise.all([
      // Current totals
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments(),
      
      // Recent orders (last 5)
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // Top products (best selling)
      Product.aggregate([
        { $match: { status: 'active' } },
        { $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'product',
          as: 'orderItems'
        }},
        { $addFields: {
          totalSales: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$price', { $sum: '$orderItems.quantity' }] } }
        }},
        { $sort: { totalSales: -1 } },
        { $limit: 5 },
        { $project: {
          name: 1,
          price: 1,
          totalSales: 1,
          totalRevenue: 1,
          images: 1
        }}
      ]),

      // Last month data for comparison
      Product.countDocuments({ 
        status: 'active',
        createdAt: { $lt: thisMonth }
      }),
      Order.countDocuments({ 
        createdAt: { $lt: thisMonth }
      }),
      User.countDocuments({ 
        createdAt: { $lt: thisMonth }
      }),
      
      // Revenue calculations
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: lastMonth, $lt: thisMonth },
          status: { $in: ['completed', 'shipped'] }
        }},
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: thisMonth },
          status: { $in: ['completed', 'shipped'] }
        }},
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ])

    // Calculate growth percentages
    const productGrowth = lastMonthProducts > 0 
      ? Math.round(((totalProducts - lastMonthProducts) / lastMonthProducts) * 100)
      : 0

    const orderGrowth = lastMonthOrders > 0 
      ? Math.round(((totalOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : 0

    const userGrowth = lastMonthUsers > 0 
      ? Math.round(((totalUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : 0

    const lastMonthRevenueTotal = lastMonthRevenue[0]?.total || 0
    const thisMonthRevenueTotal = thisMonthRevenue[0]?.total || 0
    const revenueGrowth = lastMonthRevenueTotal > 0 
      ? Math.round(((thisMonthRevenueTotal - lastMonthRevenueTotal) / lastMonthRevenueTotal) * 100)
      : 0

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
      customer: order.user?.name || order.shippingAddress?.name || 'Guest',
      amount: order.totalAmount,
      status: order.status,
      date: new Date(order.createdAt).toISOString().split('T')[0]
    }))

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      name: product.name,
      sales: product.totalSales || 0,
      revenue: product.totalRevenue || 0,
      rating: 4.8 // Default rating, can be calculated from reviews later
    }))

    const dashboardData = {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: thisMonthRevenueTotal,
        productGrowth,
        orderGrowth,
        userGrowth,
        revenueGrowth
      },
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
