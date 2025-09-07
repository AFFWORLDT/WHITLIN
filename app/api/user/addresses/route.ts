import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Get user
    const user = await User.findById(userId).lean()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Format addresses (for now, we'll use the single address from user model)
    // In a real app, you might have a separate Address model
    const addresses = []
    
    console.log('User address data:', user.address)
    
    if (user.address) {
      addresses.push({
        _id: `address-${user._id}-${Date.now()}`,
        id: `address-${user._id}-${Date.now()}`,
        type: 'Home',
        name: user.name,
        address: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country,
        phone: user.phone || '',
        isDefault: true,
        createdAt: user.createdAt
      })
    }
    
    console.log('Formatted addresses:', addresses)
    
    return NextResponse.json({
      success: true,
      data: addresses
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, addressData } = await request.json()
    
    if (!userId || !addressData) {
      return NextResponse.json(
        { success: false, error: 'User ID and address data are required' },
        { status: 400 }
      )
    }
    
    console.log('Saving address data:', addressData)
    
    // Update user's address
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        address: {
          street: addressData.address,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country
        }
      },
      { new: true }
    )
    
    console.log('Updated user:', user)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      data: {
        _id: `address-${userId}-${Date.now()}`,
        id: `address-${userId}-${Date.now()}`,
        type: 'Home',
        name: user.name,
        address: user.address?.street,
        city: user.address?.city,
        state: user.address?.state,
        zipCode: user.address?.zipCode,
        country: user.address?.country,
        isDefault: true
      }
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, addressId, addressData } = await request.json()
    
    if (!userId || !addressId || !addressData) {
      return NextResponse.json(
        { success: false, error: 'User ID, address ID, and address data are required' },
        { status: 400 }
      )
    }
    
    // Update user's address
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        address: {
          street: addressData.address,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country
        }
      },
      { new: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        id: addressId,
        type: 'Home',
        name: user.name,
        address: user.address?.street,
        city: user.address?.city,
        state: user.address?.state,
        zipCode: user.address?.zipCode,
        country: user.address?.country,
        isDefault: true
      }
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const addressId = searchParams.get('addressId')
    
    if (!userId || !addressId) {
      return NextResponse.json(
        { success: false, error: 'User ID and address ID are required' },
        { status: 400 }
      )
    }
    
    // Remove address from user
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { address: 1 } },
      { new: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address removed successfully'
    })
  } catch (error) {
    console.error('Error removing address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove address' },
      { status: 500 }
    )
  }
}
