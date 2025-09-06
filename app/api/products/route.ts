import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import { withCache, cacheKeys, cacheTTL } from '@/lib/cache'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Create cache key
    const cacheKey = cacheKeys.products(
      `${category || 'all'}-${search || ''}-${sort || 'newest'}-${minPrice || ''}-${maxPrice || ''}-${page}-${limit}`
    )

    // Try to get from cache first
    const result = await withCache(cacheKey, cacheTTL.products, async () => {
      await connectDB()

    // Build filter object
    const filter: any = { status: 'active' }

    if (category && category !== 'all') {
      // Find category by slug or name
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: category },
          { name: category }
        ]
      })
      
      if (categoryDoc) {
        filter.category = categoryDoc._id
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    // Build sort object
    let sortObj: any = { createdAt: -1 } // Default sort by newest
    switch (sort) {
      case 'price-low':
        sortObj = { price: 1 }
        break
      case 'price-high':
        sortObj = { price: -1 }
        break
      case 'rating':
        sortObj = { rating: -1 }
        break
      case 'newest':
        sortObj = { createdAt: -1 }
        break
      case 'featured':
        sortObj = { isBestSeller: -1, createdAt: -1 }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()

      const total = await Product.countDocuments(filter)

      return {
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })

    return NextResponse.json({
      success: true,
      data: result.products,
      total: result.total,
      page: result.page,
      pages: result.pages
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch products')
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newProduct = new Product(body)
    await newProduct.save()
    
    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })
  } catch (error) {
    return createErrorResponse(error, 'Failed to create product')
  }
}
