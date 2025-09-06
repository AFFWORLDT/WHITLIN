import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Guest order API called')
    
    await connectDB()
    console.log('MongoDB connected')

    const body = await request.json()
    console.log('Request body:', body)

    const { 
      email, 
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      country,
      items, 
      totalAmount,
      paymentMethod = 'cod'
    } = body

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !address || !city || !state || !zipCode || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Check if user exists
    console.log('Looking up user with email:', email.toLowerCase().trim())
    let user = await User.findOne({ email: email.toLowerCase().trim() })
    console.log('User lookup result:', user ? 'found' : 'not found')

    let isNewUser = false
    let generatedPassword = ''

    if (!user) {
      // Generate a random password
      generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
      const hashedPassword = await bcrypt.hash(generatedPassword, 12)
      
      // Create new user
      user = new User({
        email: email.toLowerCase().trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role: 'customer',
        addresses: [{
          type: 'shipping',
          street: address,
          city: city,
          state: state,
          zipCode: zipCode,
          country: country || 'India',
          isDefault: true
        }]
      })

      console.log('Saving new user...')
      await user.save()
      isNewUser = true
      console.log('New user created:', user._id)
    }

    // Create order items with proper structure
    const orderItems = items.map((item: any) => ({
      product: item.product,
      name: item.name || 'Product',
      quantity: item.quantity,
      price: item.price,
      image: item.image || 'https://via.placeholder.com/150',
      total: item.price * item.quantity
    }))

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const shipping = subtotal > 1000 ? 0 : 100
    const tax = subtotal * 0.18
    const finalTotal = subtotal + shipping + tax

    // Create order
    console.log('Creating order with data:', {
      orderNumber: `KG${Date.now().toString().slice(-8)}`,
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      totalAmount: finalTotal
    })
    
    const order = new Order({
      orderNumber: `KG${Date.now().toString().slice(-8)}`,
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: 0,
      totalAmount: finalTotal,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod,
      priority: 'normal',
      source: 'guest-checkout',
      shippingAddress: {
        street: address,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country || 'India'
      },
      billingAddress: {
        street: address,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country || 'India'
      },
      tags: ['guest-order'],
      metadata: {
        isGuestOrder: true,
        originalEmail: email
      }
    })

    console.log('Saving order...')
    await order.save()
    console.log('Order created:', order._id)

    // Send account creation email if new user
    if (isNewUser && generatedPassword) {
      try {
        console.log(`Would send account creation email to: ${email} with password: ${generatedPassword}`)
        // TODO: Enable email sending later
      } catch (emailError) {
        console.error('Error sending account creation email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        email: email,
        isNewUser: isNewUser,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    })

  } catch (error) {
    console.error('Guest order creation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}