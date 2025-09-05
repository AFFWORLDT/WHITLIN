import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const parent = searchParams.get('parent')

    // Build filter object
    const filter: any = {}

    if (active === 'true') {
      filter.isActive = true
    }

    if (parent) {
      filter.parent = parent
    } else {
      filter.parent = null // Only top-level categories
    }

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    const newCategory = new Category(body)
    await newCategory.save()
    
    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
