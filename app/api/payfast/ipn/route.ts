import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/supabase/orders'
import { sendEmail } from '@/lib/supabase/email'
import { buyerEmailTemplate, retailerEmailTemplate } from '@/lib/supabase/emailTemplates'

export async function POST(req: NextRequest) {
  try {
    const ipnData = await req.text()
    // TODO: verify with PayFast sandbox/live
    const params = Object.fromEntries(new URLSearchParams(ipnData))
    const orderId = params.m_payment_id
    const paymentStatus = params.payment_status

    if (!orderId) return NextResponse.json({ status: 'error' }, { status: 400 })

    const order = await getOrderById(orderId)
    if (!order) return NextResponse.json({ status: 'error' }, { status: 404 })

    if (paymentStatus === 'COMPLETE' && order.status !== 'paid') {
      await updateOrderStatus(orderId, 'paid', params.pf_payment_id)

      // Send emails
      await sendEmail(
        order.customer.email,
        'Order Confirmation & Invoice',
        buyerEmailTemplate(order)
      )

      await sendEmail(
        order.retailer.email,
        'New Order Notification',
        retailerEmailTemplate(order)
      )
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
