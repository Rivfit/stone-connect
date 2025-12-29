// app/api/ozow/notify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getOrderById, updateOrderStatus } from '@/lib/supabase/orders'
import { sendEmail } from '@/lib/supabase/email'
import { buyerEmailTemplate, retailerEmailTemplate } from '@/lib/supabase/emailTemplates'

export async function POST(req: NextRequest) {
  try {
    // Get form data from Ozow
    const formData = await req.formData()
    
    const siteCode = formData.get('SiteCode') as string
    const transactionId = formData.get('TransactionId') as string
    const transactionReference = formData.get('TransactionReference') as string
    const amount = formData.get('Amount') as string
    const status = formData.get('Status') as string
    const statusMessage = formData.get('StatusMessage') as string
    const currencyCode = formData.get('CurrencyCode') as string
    const isTest = formData.get('IsTest') as string
    const hashCheck = formData.get('HashCheck') as string

    console.log('Ozow webhook received:', {
      transactionId,
      transactionReference,
      status,
      amount
    })

    // Verify hash for security
    const privateKey = process.env.OZOW_PRIVATE_KEY!
    const hashString = [
      siteCode,
      transactionId,
      transactionReference,
      amount,
      status,
      statusMessage || '',
      currencyCode,
      isTest,
      privateKey
    ].join('')

    const calculatedHash = crypto
      .createHash('sha512')
      .update(hashString.toLowerCase())
      .digest('hex')

    if (calculatedHash !== hashCheck.toLowerCase()) {
      console.error('Ozow hash verification failed')
      return NextResponse.json(
        { success: false, error: 'Invalid hash' },
        { status: 400 }
      )
    }

    const orderId = transactionReference

    if (!orderId) {
      console.error('No order ID in webhook')
      return NextResponse.json(
        { success: false, error: 'No order ID' },
        { status: 400 }
      )
    }

    // Get order from database
    const order = await getOrderById(orderId)
    if (!order) {
      console.error('Order not found:', orderId)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Ozow status codes:
    // Complete = Payment successful
    // Cancelled = User cancelled
    // Error = Payment failed
    // PendingInvestigation = Requires manual review
    
    if (status === 'Complete' && order.status !== 'paid') {
      console.log('Payment successful, updating order:', orderId)
      
      // Update order status to paid
      await updateOrderStatus(orderId, 'paid', transactionId)

      // Send confirmation email to customer
      await sendEmail(
        order.customer.email,
        'Order Confirmation & Invoice - Stone Connect',
        buyerEmailTemplate(order)
      )

      // Send notification to retailer
      await sendEmail(
        order.retailer.email,
        'New Order Notification - Stone Connect',
        retailerEmailTemplate(order)
      )

      console.log('Emails sent successfully for order:', orderId)

      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully' 
      })
    } 
    else if (status === 'Cancelled') {
      console.log('Payment cancelled by user:', orderId)
      // Just log it, don't update status as updateOrderStatus might only accept 'paid'
      // If you want to track cancellations, update your updateOrderStatus function
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment cancelled' 
      })
    }
    else if (status === 'Error') {
      console.log('Payment error:', orderId, statusMessage)
      // Just log it, don't update status as updateOrderStatus might only accept 'paid'
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment failed' 
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Ozow webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Allow POST requests from Ozow
export const dynamic = 'force-dynamic'