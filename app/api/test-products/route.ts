import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET() {
  try {
    await connectDB()
    
    // Get first 5 products to test
    const products = await Product.find({ status: 'active' })
      .limit(5)
      .lean()
    
    console.log('Test products:', products.map(p => ({ 
      name: p.name, 
      images: p.images, 
      image: p.image,
      hasImages: !!(p.images && p.images.length > 0),
      hasImage: !!p.image
    })))
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        images: p.images,
        image: p.image,
        hasImages: !!(p.images && p.images.length > 0),
        hasImage: !!p.image
      }))
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
