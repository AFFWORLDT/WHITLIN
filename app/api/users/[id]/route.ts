import { NextRequest, NextResponse } from 'next/server'

// Mock data - in real app this would come from database
let users = [
  {
    id: "user-001",
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    status: "active",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US"
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true
    },
    stats: {
      totalOrders: 5,
      totalSpent: 1299.95,
      lastOrderDate: "2024-01-15"
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const user = users.find(u => u.id === userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: users[userIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Don't allow deleting admin users
    if (users[userIndex].role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete admin users' },
        { status: 400 }
      )
    }

    // Remove user
    users.splice(userIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
