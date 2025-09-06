import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  quantity: number
  price: number
  image: string
  total: number
}

export interface IShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: IShippingAddress
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false })

const ShippingAddressSchema = new Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, { _id: false })

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Index for better query performance
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ user: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)