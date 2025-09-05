"use client"

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51234567890abcdef')

interface StripePaymentProps {
  amount: number
  currency?: string
  customerEmail?: string
  customerName?: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: any) => void
}

function CheckoutForm({ 
  amount, 
  currency = 'AED', 
  customerEmail, 
  customerName, 
  onSuccess, 
  onError 
}: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        customerEmail,
        customerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.clientSecret)
        } else {
          toast.error(data.error || 'Failed to create payment intent')
          onError?.(data.error)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        toast.error('Failed to initialize payment')
        onError?.(error)
      })
  }, [amount, currency, customerEmail, customerName, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    })

    if (error) {
      console.error('Payment failed:', error)
      toast.error(error.message || 'Payment failed')
      onError?.(error)
    } else {
      toast.success('Payment successful!')
      onSuccess?.(error)
    }

    setLoading(false)
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Initializing payment...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {currency} {amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your payment securely with Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <CheckoutForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}
