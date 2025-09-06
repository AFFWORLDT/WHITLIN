import { NextRequest, NextResponse } from 'next/server'
import { testEmailConnection, sendNewUserNotification, sendWelcomeEmail, sendForgotPasswordEmail } from '@/lib/email-service'

export async function GET(request: NextRequest) {
  try {
    // Test email connection
    const connectionTest = await testEmailConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Email connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email service is working correctly',
      details: connectionTest.message
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test email service'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userData } = body

    if (type === 'new-user') {
      // Test new user notification
      const result = await sendNewUserNotification({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com',
        phone: userData.phone || '1234567890',
        registrationDate: new Date().toLocaleString()
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'New user notification sent successfully' : 'Failed to send notification',
        details: result
      })
    } else if (type === 'welcome') {
      // Test welcome email
      const result = await sendWelcomeEmail({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Welcome email sent successfully' : 'Failed to send welcome email',
        details: result
      })
    } else if (type === 'forgot-password') {
      // Test forgot password email
      const result = await sendForgotPasswordEmail({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com',
        otp: userData.otp || '123456'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Forgot password email sent successfully' : 'Failed to send forgot password email',
        details: result
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid test type. Use "new-user", "welcome", or "forgot-password"'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test email service'
    }, { status: 500 })
  }
}
