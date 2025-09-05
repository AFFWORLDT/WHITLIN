import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter object
    const filter: any = {}

    if (category && category !== 'all') {
      // Find category by slug or name
      const Category = require('@/lib/models/Category').default
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

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
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
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
