import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import { withCache, cacheKeys, cacheTTL } from '@/lib/cache'
import { createErrorResponse } from '@/lib/error-handler'
import { CacheManager, CACHE_TAGS } from '@/lib/cache-optimizer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const noCache = searchParams.get('noCache') === 'true' // Allow bypassing cache

    // Create cache key
    const cacheKey = cacheKeys.products(
      `${category || 'all'}-${search || ''}-${sort || 'newest'}-${minPrice || ''}-${maxPrice || ''}-${featured || 'false'}-${page}-${limit}`
    )

    // Fetch function (used with or without cache)
    const fetchProducts = async () => {
      // connectDB now has built-in retry logic for SSL/TLS errors
      await connectDB()

      // Build filter object
      const filter: any = { status: 'active' }

      // Handle featured products - only use fields that exist in the Product model
      if (featured === 'true') {
        // Use $and to combine status with featured conditions
        filter.$and = [
          { status: 'active' },
          {
            $or: [
              { isBestSeller: true },
              { isNewProduct: true }
            ]
          }
        ]
        // Remove status from top level since it's in $and
        delete filter.status
      }

      if (category && category !== 'all') {
        // Find category by slug or name with retry
        const categoryDoc = await executeWithRetry(
          () => Category.findOne({
            $or: [
              { slug: category },
              { name: category }
            ]
          }),
          'Category lookup',
          5
        )
        
        if (categoryDoc) {
          // If featured filter is active, add category to $and array
          if (featured === 'true' && filter.$and && Array.isArray(filter.$and)) {
            filter.$and.push({ category: categoryDoc._id })
          } else if (featured === 'true') {
            // If $and doesn't exist yet, create it
            filter.$and = [
              { status: 'active' },
              {
                $or: [
                  { isBestSeller: true },
                  { isNewProduct: true }
                ]
              },
              { category: categoryDoc._id }
            ]
            delete filter.status
          } else {
            // If not featured, just add category to filter
            filter.category = categoryDoc._id
          }
        }
      }

    if (search) {
      const searchFilter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (featured === 'true') {
        // When both featured and search are present, use $and to combine conditions
        // Check if $and already exists (from featured filter)
        if (filter.$and && Array.isArray(filter.$and)) {
          // Add search filter to existing $and array
          filter.$and.push(searchFilter)
        } else {
          // Create new $and array with status, featured, and search
          filter.$and = [
            { status: 'active' },
            {
              $or: [
                { isBestSeller: true },
                { isNewProduct: true }
              ]
            },
            searchFilter
          ]
          delete filter.$or
          delete filter.status
        }
      } else {
        // If not featured, just add search filter
        if (filter.$or && Array.isArray(filter.$or)) {
          // Merge with existing $or conditions
          filter.$or = [...filter.$or, ...searchFilter.$or]
        } else {
          filter.$or = searchFilter.$or
        }
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    // Build sort object
    let sortObj: any = { createdAt: -1 } // Default sort by newest
    
    // If featured is true and no explicit sort, prioritize best sellers
    if (featured === 'true' && !sort) {
      sortObj = { isBestSeller: -1, isNewProduct: -1, createdAt: -1 }
    } else {
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
          sortObj = { isBestSeller: -1, isNewProduct: -1, createdAt: -1 }
          break
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

      // Execute query with retry
      let products = await executeWithRetry(
        () => Product.find(filter)
          .populate('category', 'name slug')
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .lean(),
        'Product query',
        5
      )

      // If featured=true and no products found, fallback to all active products
      if (featured === 'true' && products.length === 0 && page === 1) {
        console.log('No featured products found, falling back to all active products')
        const fallbackFilter: any = { status: 'active' }
        products = await executeWithRetry(
          () => Product.find(fallbackFilter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          'Product fallback query',
          5
        )
      }

      // Ensure images array is properly formatted and all required fields exist
      const formattedProducts = products.map(product => {
        // Ensure images array exists
        const images = product.images && product.images.length > 0 
          ? product.images.filter(img => img && typeof img === 'string')
          : (product.image && typeof product.image === 'string' ? [product.image] : ['/placeholder.jpg'])
        
        // Ensure category exists
        const category = product.category || { name: 'General' }
        
        // Ensure attributes array exists
        const attributes = Array.isArray(product.attributes) 
          ? product.attributes.filter(attr => attr && attr.name && attr.value)
          : []
        
        return {
          ...product,
          _id: product._id || product.id || `product-${Date.now()}`,
          id: product._id || product.id || `product-${Date.now()}`,
          name: product.name || 'Product',
          price: typeof product.price === 'number' && product.price >= 0 ? product.price : 0,
          description: product.description || 'Premium quality product',
          images: images.length > 0 ? images : ['/placeholder.jpg'],
          image: images[0] || '/placeholder.jpg',
          category: typeof category === 'string' ? { name: category } : category,
          attributes: attributes,
          isActive: product.isActive !== undefined ? product.isActive : (product.status === 'active'),
          status: product.status || 'active',
          sku: product.sku || `SKU-${product._id || Date.now()}`,
          rating: typeof product.rating === 'number' ? product.rating : 4.5,
          reviews: typeof product.reviews === 'number' ? product.reviews : 0,
          createdAt: product.createdAt || new Date().toISOString()
        }
      })

      // Get total count with retry - use fallback filter if we used fallback for products
      let total = await executeWithRetry(
        () => Product.countDocuments(filter),
        'Product count',
        5
      )
      if (featured === 'true' && total === 0 && page === 1) {
        total = await executeWithRetry(
          () => Product.countDocuments({ status: 'active' }),
          'Product fallback count',
          5
        )
      }

      return {
        products: formattedProducts,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }

    // Use cache or fetch directly
    const result = noCache 
      ? await fetchProducts() 
      : await withCache(cacheKey, cacheTTL.products, fetchProducts)

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
