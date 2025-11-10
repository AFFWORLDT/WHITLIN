import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get all products for accurate statistics with retry
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      allProducts,
      categories
    ] = await Promise.all([
      executeWithRetry(() => Product.countDocuments({ status: 'active' }), 'Total products count', 5),
      executeWithRetry(() => Product.countDocuments({ status: 'active', stock: { $gt: 0 } }), 'Active products count', 5),
      executeWithRetry(() => Product.countDocuments({ status: 'active', stock: 0 }), 'Out of stock count', 5),
      executeWithRetry(() => Product.find({ status: 'active' }).lean(), 'All products', 5),
      executeWithRetry(() => Category.find({ active: true }).select('name slug').lean(), 'Categories', 5)
    ])

    // Calculate total stock value
    const totalStockValue = allProducts.reduce((sum, product) => {
      return sum + (product.price * product.stock)
    }, 0)

    // Get category distribution with retry
    const categoryStats = await executeWithRetry(
      () => Product.aggregate([
        { $match: { status: 'active' } },
        { $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }},
        { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
        { $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }},
        { $sort: { count: -1 } }
      ]),
      'Category stats',
      5
    )

    // Get price range statistics with retry
    const priceStats = await executeWithRetry(
      () => Product.aggregate([
        { $match: { status: 'active' } },
        { $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }}
      ]),
      'Price stats',
      5
    )

    const stats = {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalStockValue,
      categoryStats,
      priceStats: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
      categories: categories.map(cat => ({ name: cat.name, slug: cat.slug }))
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Products stats API error:', error)
    return createErrorResponse(error, 'Failed to fetch product statistics')
  }
}
