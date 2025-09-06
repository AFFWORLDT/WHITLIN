import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { authRateLimit } from '@/lib/rate-limit'
import { verifyOTP, markOTPAsUsed } from '@/lib/otp-store'

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
    const { email, otp, newPassword } = body
    
    // Validate input
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
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
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    })
    
    // Mark OTP as used in memory store
    markOTPAsUsed(email.toLowerCase().trim())
    
    console.log(`Password reset successful for user: ${user.email}`)
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
