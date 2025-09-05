import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret'
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Update order status in your database
        // await updateOrderStatus(paymentIntent.metadata.orderId, 'paid')
        
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        
        // Update order status in your database
        // await updateOrderStatus(failedPayment.metadata.orderId, 'failed')
        
        break
      
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        
        // Update order status in your database
        // await updateOrderStatus(session.metadata.orderId, 'paid')
        
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
