import { NextRequest, NextResponse } from 'next/server'

// Mock data - in real app this would come from database
let orders = [
  {
    id: "ORD-001",
    userId: "user-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567"
    },
    items: [
      {
        productId: 1,
        name: "KeraGold Expert Liss System",
        price: 299.99,
        quantity: 1,
        image: "/images/expert-liss-system.jpeg"
      }
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US"
    },
    paymentMethod: "card",
    paymentInfo: {
      last4: "4242",
      brand: "visa"
    },
    status: "completed",
    total: 299.99,
    subtotal: 299.99,
    shipping: 0,
    tax: 0,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18"
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const order = orders.find(o => o.id === orderId)

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const body = await request.json()
    
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: orders[orderIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Remove order
    orders.splice(orderIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
