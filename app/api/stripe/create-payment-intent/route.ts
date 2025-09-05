import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'AED', customerEmail, customerName } = await request.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Get Stripe settings from request headers or use default
    const stripeSecretKey = request.headers.get('x-stripe-secret-key') || 'sk_test_51234567890abcdef'
    
    // Initialize Stripe with the provided key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })

    // Create customer if email provided
    let customerId = null
    if (customerEmail) {
      const customerResult = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
      })
      customerId = customerResult.id
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
