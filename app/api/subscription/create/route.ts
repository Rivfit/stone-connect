import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { retailer_id, email, amount } = await req.json()

    if (!retailer_id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // PayFast credentials
    const merchant_id = process.env.PAYFAST_MERCHANT_ID || '10043867'
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY || 'cs3kbgt7v5usq'
    const passphrase = process.env.PAYFAST_PASSPHRASE || ''
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create subscription ID
    const subscription_token = `SUB-${Date.now()}-${retailer_id.slice(0, 8)}`

    // PayFast subscription parameters
    const paymentData: Record<string, string> = {
      merchant_id,
      merchant_key,
      return_url: `${baseUrl}/retailer/subscription/success`,
      cancel_url: `${baseUrl}/retailer/subscription/cancelled`,
      notify_url: `${baseUrl}/api/subscription/notify`,
      
      // Subscription details
      subscription_type: '1', // 1 = subscription
      billing_date: getNextBillingDate(), // First of next month
      recurring_amount: amount.toFixed(2),
      frequency: '3', // 3 = monthly
      cycles: '0', // 0 = indefinite
      
      // Item details
      item_name: 'Stone Connect Premium Subscription',
      item_description: 'Monthly premium membership',
      amount: amount.toFixed(2),
      
      // Customer details
      email_address: email,
      m_payment_id: subscription_token,
      
      // Custom fields
      custom_str1: retailer_id,
      custom_str2: 'premium_subscription'
    }

    // Generate signature
    const signature = generatePayFastSignature(paymentData, passphrase)
    paymentData.signature = signature

    // Build PayFast URL
    const isSandbox = !process.env.PAYFAST_MERCHANT_ID || process.env.NODE_ENV !== 'production'
    const payfastHost = isSandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za'
    const payfastUrl = `https://${payfastHost}/eng/process?${new URLSearchParams(paymentData).toString()}`

    // Save subscription intent to database
    await supabase
      .from('subscription_intents')
      .insert([{
        retailer_id,
        subscription_token,
        amount,
        status: 'pending',
        created_at: new Date().toISOString()
      }])

    console.log('✅ Subscription created:', subscription_token)

    return NextResponse.json({
      success: true,
      payfastUrl,
      subscription_token
    })

  } catch (error) {
    console.error('❌ Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

function getNextBillingDate(): string {
  const now = new Date()
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear()
  const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1
  const billingDate = new Date(year, month, 1)
  
  // Format as YYYY-MM-DD
  return billingDate.toISOString().split('T')[0]
}

function generatePayFastSignature(data: Record<string, string>, passphrase: string = ''): string {
  let pfParamString = ''
  for (const key in data) {
    if (data.hasOwnProperty(key) && key !== 'signature') {
      pfParamString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`
    }
  }
  
  pfParamString = pfParamString.slice(0, -1)
  
  if (passphrase) {
    pfParamString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }
  
  return crypto.createHash('md5').update(pfParamString).digest('hex')
}