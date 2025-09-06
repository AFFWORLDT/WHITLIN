import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { authRateLimit } from '@/lib/rate-limit'
import { sendForgotPasswordEmail } from '@/lib/email-service'
import { storeOTP } from '@/lib/otp-store'

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many password reset attempts. Please try again later.',
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
    const { email } = body
    
    // Validate input
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset OTP has been sent.'
      })
    }
    
    // Generate OTP and set expiration (10 minutes from now)
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    // Store OTP in memory store
    storeOTP(user.email, otp, expiresAt)
    
    // Send OTP email
    try {
      await sendForgotPasswordEmail({
        name: user.name,
        email: user.email,
        otp: otp
      })
      
      console.log(`Password reset OTP sent to ${user.email}: ${otp}`)
    } catch (emailError) {
      console.error('Error sending forgot password email:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset OTP has been sent.'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
