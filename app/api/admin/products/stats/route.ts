import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get all products for accurate statistics
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      allProducts,
      categories
    ] = await Promise.all([
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'active', stock: { $gt: 0 } }),
      Product.countDocuments({ status: 'active', stock: 0 }),
      Product.find({ status: 'active' }).lean(),
      Category.find({ active: true }).select('name slug').lean()
    ])

    // Calculate total stock value
    const totalStockValue = allProducts.reduce((sum, product) => {
      return sum + (product.price * product.stock)
    }, 0)

    // Get category distribution
    const categoryStats = await Product.aggregate([
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
    ])

    // Get price range statistics
    const priceStats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' }
      }}
    ])

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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product statistics' },
      { status: 500 }
    )
  }
}
