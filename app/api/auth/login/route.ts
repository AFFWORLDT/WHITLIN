import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { authRateLimit } from '@/lib/rate-limit'
import { validateRequestBody, loginSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validation = validateRequestBody(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          details: validation.details
        },
        { status: 400 }
      )
    }
    
    const { email, password } = validation.data
    
    // Check if user exists and determine if it's an admin
    const user = await User.findOne({ email: email.toLowerCase() })
    const isAdminUser = user && (user.role === 'admin' || user.email === 'admin@keragold.com')
    
    // Apply rate limiting only for non-admin users
    if (!isAdminUser) {
      const rateLimitResult = authRateLimit(request)
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many login attempts. Please try again later.',
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }
    }
    
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
