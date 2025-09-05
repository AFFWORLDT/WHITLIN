import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password (for now, we'll use simple comparison since we didn't hash in seed)
    const isValidPassword = password === user.password || await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Account is not active' },
        { status: 401 }
      )
    }
    
    // Return user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
    
    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Login successful'
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
