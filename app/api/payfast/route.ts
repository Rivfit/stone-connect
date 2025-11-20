import { NextRequest, NextResponse } from 'next/server'
import queryString from 'query-string'
import crypto from 'crypto'
import { saveOrder } from '../../../lib/orders'

export async function POST(req: NextRequest) {
  const { cart, cartTotal, customer } = await req.json()

  const commission = cartTotal * 0.1
  const retailerPayout = cartTotal - commission

  // Generate unique order ID
  const orderId = crypto.randomUUID()

  // Save order in DB as pending
  saveOrder({
    id: orderId,
    customer,
    cart,
    cartTotal,
    commission,
    retailerPayout,
    status: 'pending',
    retailer: { email: 'retailer@example.com' } // replace with actual retailer email from your product data
  })

  const merchantId = '10043867'
  const merchantKey = 'cs3kbgt7v5usq'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const payfastData = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    amount: cartTotal.toFixed(2),
    item_name: `Order for ${customer.firstName} ${customer.lastName}`,
    return_url: `${baseUrl}/checkout/success`,
    cancel_url: `${baseUrl}/checkout/cancel`,
    notify_url: `${baseUrl}/api/payfast/ipn`,
    m_payment_id: orderId,
  }

  const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${queryString.stringify(payfastData)}`

  return NextResponse.json({ payfastUrl })
}
