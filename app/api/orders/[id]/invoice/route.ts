import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name sku price image')

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Generate PDF content
    const pdfContent = generateInvoicePDF(order)

    return new NextResponse(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

function generateInvoicePDF(order: any) {
  // Simple HTML-based PDF generation
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #d4af37;
          margin-bottom: 10px;
        }
        .invoice-title {
          font-size: 28px;
          margin: 10px 0;
        }
        .invoice-number {
          font-size: 16px;
          color: #666;
        }
        .content {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .billing-info, .order-info {
          width: 45%;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #d4af37;
        }
        .info-row {
          margin-bottom: 8px;
        }
        .label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .items-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .items-table .text-right {
          text-align: right;
        }
        .totals {
          float: right;
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        .total-row.final {
          border-top: 2px solid #d4af37;
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
          padding-top: 15px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-${order.status} {
          background-color: ${getStatusColor(order.status)};
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">KeraGold</div>
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">${order.orderNumber}</div>
      </div>

      <div class="content">
        <div class="billing-info">
          <div class="section-title">Bill To:</div>
          <div class="info-row">
            <span class="label">Name:</span>
            ${order.user?.name || 'N/A'}
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            ${order.user?.email || 'N/A'}
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            ${order.user?.phone || 'N/A'}
          </div>
          <div class="info-row">
            <span class="label">Address:</span>
            ${order.shippingAddress?.address || 'N/A'}<br>
            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}<br>
            ${order.shippingAddress?.country || ''}
          </div>
        </div>

        <div class="order-info">
          <div class="section-title">Order Information:</div>
          <div class="info-row">
            <span class="label">Order Date:</span>
            ${new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="status-badge status-${order.status}">${order.status.replace('_', ' ')}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment:</span>
            ${(order.paymentMethod || 'cash_on_delivery').replace('_', ' ').toUpperCase()}
          </div>
          <div class="info-row">
            <span class="label">Payment Status:</span>
            <span class="status-badge status-${order.paymentStatus}">${(order.paymentStatus || 'pending').replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: any) => `
            <tr>
              <td>${item.product?.name || 'N/A'}</td>
              <td>${item.product?.sku || 'N/A'}</td>
              <td>${item.quantity}</td>
              <td class="text-right">AED ${(item.price || 0).toFixed(2)}</td>
              <td class="text-right">AED ${(item.total || 0).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>AED ${(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>AED ${(order.shipping || 0).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>AED ${(order.tax || 0).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Discount:</span>
          <span>-AED ${(order.discount || 0).toFixed(2)}</span>
        </div>
        <div class="total-row final">
          <span>Total:</span>
          <span>AED ${(order.totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>KeraGold - Professional Hair Care Solutions</p>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `

  // For now, return HTML content
  // In production, you would use a PDF library like puppeteer or jsPDF
  return html
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return '#f59e0b'
    case 'confirmed': return '#3b82f6'
    case 'processing': return '#8b5cf6'
    case 'packed': return '#06b6d4'
    case 'shipped': return '#10b981'
    case 'out_for_delivery': return '#f59e0b'
    case 'delivered': return '#10b981'
    case 'cancelled': return '#ef4444'
    case 'returned': return '#f97316'
    case 'refunded': return '#6b7280'
    case 'paid': return '#10b981'
    case 'failed': return '#ef4444'
    case 'partially_refunded': return '#f59e0b'
    default: return '#6b7280'
  }
}
