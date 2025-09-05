import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'customer' })
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments({ status: 'active' })
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
    
    // Get top products (based on order items)
    const topProductsResult = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { 
          _id: '$items.product', 
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        } 
      },
      { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $project: {
          name: '$product.name',
          sales: '$totalQuantity',
          revenue: '$totalRevenue',
          rating: '$product.rating'
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 4 }
    ])
    
    // Get monthly sales data (last 4 months)
    const monthlySales = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 4 }
    ])
    
    // Format monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const salesData = monthlySales.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
      orders: item.orders
    }))
    
    // Calculate conversion rate (simplified)
    const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalUsers,
          conversionRate: parseFloat(conversionRate),
          avgOrderValue: parseFloat(avgOrderValue)
        },
        salesData,
        topProducts: topProductsResult,
        recentOrders: recentOrders.map(order => ({
          id: order.orderNumber,
          customer: order.customer?.name || 'Unknown',
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
