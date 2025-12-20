import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function generateSignature(data: any, passPhrase: string = '') {
  let pfOutput = ''
  for (let key in data) {
    if (data.hasOwnProperty(key) && key !== 'signature') {
      pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`
    }
  }

  let getString = pfOutput.slice(0, -1)
  
  if (passPhrase !== '') {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`
  }

  return crypto.createHash('md5').update(getString).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, retailer, plan, amount } = await req.json()

    const merchant_id = process.env.PAYFAST_MERCHANT_ID || '10043867'
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY || 'cs3kbgt7v5usq'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // For subscriptions, PayFast supports recurring billing
    const payfastData = {
      merchant_id,
      merchant_key,
      return_url: `${baseUrl}/retailer/subscription/success`,
      cancel_url: `${baseUrl}/retailer/subscription/cancel`,
      notify_url: `${baseUrl}/api/subscription/webhook`,
      
      // Subscription details
      subscription_type: '1', // 1 = Subscription
      billing_date: new Date().toISOString().split('T')[0], // Start today
      recurring_amount: amount.toFixed(2),
      frequency: plan === 'monthly' ? '3' : '6', // 3 = Monthly, 6 = Annual
      cycles: '0', // 0 = Until cancelled
      
      // Order details
      amount: amount.toFixed(2),
      item_name: `Stone Connect Premium - ${plan}`,
      item_description: `${plan === 'monthly' ? 'Monthly' : 'Annual'} premium subscription`,
      
      // Customer details
      email_address: retailer.email,
      name_first: retailer.business_name.split(' ')[0] || 'Business',
      name_last: retailer.business_name.split(' ').slice(1).join(' ') || 'Owner',
      cell_number: retailer.phone || '',
      
      // Custom data
      m_payment_id: subscriptionId,
      custom_str1: retailer.id,
      custom_str2: plan,
    }

    const signature = generateSignature(payfastData, merchant_key)

    return NextResponse.json({
      payfastData: {
        ...payfastData,
        signature
      },
      payfastUrl: 'https://sandbox.payfast.co.za/eng/process'
    })
  } catch (error) {
    console.error('Subscription payment error:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}