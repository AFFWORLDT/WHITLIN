import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { authRateLimit } from '@/lib/rate-limit'
import { validateRequestBody, registerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.',
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

    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validation = validateRequestBody(registerSchema, body)
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
    
    const { name, email, password, phone } = validation.data
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
      status: 'active'
    })
    
    await newUser.save()
    
    // Return user data (without password)
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }
    
    return NextResponse.json({
      success: true,
      data: userData,
      message: 'User created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
