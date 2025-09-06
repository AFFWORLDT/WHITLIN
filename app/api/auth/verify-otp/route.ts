import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { authRateLimit } from '@/lib/rate-limit'
import { verifyOTP } from '@/lib/otp-store'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many OTP verification attempts. Please try again later.',
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
    const { email, otp } = body
    
    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or OTP' },
        { status: 400 }
      )
    }
    
    // Verify OTP using memory store
    const isValidOTP = verifyOTP(email.toLowerCase().trim(), otp)
    
    if (!isValidOTP) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
      data: {
        email: user.email,
        name: user.name
      }
    })
    
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
