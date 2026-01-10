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
    const statusMessage = formData.get('StatusMessage') as string | null
    const currencyCode = formData.get('CurrencyCode') as string
    const isTest = formData.get('IsTest') as string
    const hashCheck = formData.get('HashCheck') as string

    console.log('Ozow webhook received:', {
      transactionId,
      transactionReference,
      status,
      amount,
      statusMessage
    })

    // Verify hash for security
    const privateKey = process.env.OZOW_PRIVATE_KEY!
    const hashString = [
      siteCode || '',
      transactionId || '',
      transactionReference || '',
      amount || '',
      status || '',
      statusMessage || '',  // Handle null statusMessage
      currencyCode || '',
      isTest || '',
      privateKey
    ].join('')

    console.log('Hash verification - input string length:', hashString.length)

    const calculatedHash = crypto
      .createHash('sha512')
      .update(hashString.toLowerCase())
      .digest('hex')

    console.log('Calculated hash:', calculatedHash.substring(0, 20) + '...')
    console.log('Received hash:', hashCheck ? hashCheck.substring(0, 20) + '...' : 'null')

    if (!hashCheck || calculatedHash !== hashCheck.toLowerCase()) {
      console.error('Ozow hash verification failed')
      console.error('Expected:', calculatedHash)
      console.error('Received:', hashCheck)
      return NextResponse.json(
        { success: false, error: 'Invalid hash' },
        { status: 400 }
      )
    }

    console.log('✅ Hash verified successfully')

    const orderId = transactionReference

    if (!orderId) {
      console.error('No order ID in webhook')
      return NextResponse.json(
        { success: false, error: 'No order ID' },
        { status: 400 }
      )
    }

    // Get order from database
    console.log('Fetching order from database:', orderId)
    const order = await getOrderById(orderId)
    
    if (!order) {
      console.error('Order not found:', orderId)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    console.log('Order found:', { 
      orderId: order.id, 
      status: order.status,
      customerEmail: order.customer.email,
      retailerEmail: order.retailer.email
    })

    // Ozow status codes:
    // Complete = Payment successful
    // Cancelled = User cancelled
    // Error = Payment failed
    // PendingInvestigation = Requires manual review
    
    if (status === 'Complete' && order.status !== 'paid') {
      console.log('💰 Payment successful, updating order:', orderId)
      
      // Update order status to paid
      await updateOrderStatus(orderId, 'paid', transactionId)
      console.log('✅ Order status updated to paid')

      // Send confirmation email to customer
      try {
        console.log('📧 Sending email to customer:', order.customer.email)
        await sendEmail(
          order.customer.email,
          'Order Confirmation & Invoice - Stone Connect',
          buyerEmailTemplate(order)
        )
        console.log('✅ Customer email sent successfully')
      } catch (emailError) {
        console.error('❌ Failed to send customer email:', emailError)
        // Continue even if email fails
      }

      // Send notification to retailer
      try {
        console.log('📧 Sending email to retailer:', order.retailer.email)
        await sendEmail(
          order.retailer.email,
          'New Order Notification - Stone Connect',
          retailerEmailTemplate(order)
        )
        console.log('✅ Retailer email sent successfully')
      } catch (emailError) {
        console.error('❌ Failed to send retailer email:', emailError)
        // Continue even if email fails
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully' 
      })
    } 
    else if (status === 'Complete' && order.status === 'paid') {
      console.log('ℹ️ Order already marked as paid:', orderId)
      return NextResponse.json({ 
        success: true, 
        message: 'Order already processed' 
      })
    }
    else if (status === 'Cancelled') {
      console.log('❌ Payment cancelled by user:', orderId)
      return NextResponse.json({ 
        success: true, 
        message: 'Payment cancelled' 
      })
    }
    else if (status === 'Error') {
      console.log('❌ Payment error:', orderId, statusMessage)
      return NextResponse.json({ 
        success: true, 
        message: 'Payment failed' 
      })
    }

    console.log('⚠️ Unhandled payment status:', status)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('❌ Ozow webhook error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}

// Allow POST requests from Ozow
export const dynamic = 'force-dynamic'