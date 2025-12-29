// app/api/ozow/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { saveOrder } from '@/lib/supabase/orders'

export async function POST(req: NextRequest) {
  try {
    const { cart, cartTotal, customer } = await req.json()

    const commission = cartTotal * 0.1
    const retailerPayout = cartTotal - commission

    // Generate unique order ID
    const orderId = crypto.randomUUID()

    // Get Ozow credentials from environment
    const siteCode = process.env.OZOW_SITE_CODE!
    const privateKey = process.env.OZOW_PRIVATE_KEY!
    const isTest = process.env.OZOW_IS_TEST === 'true'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Save order in DB as pending
    await saveOrder({
      id: orderId,
      customer,
      cart,
      cartTotal,
      commission,
      retailerPayout,
      status: 'pending',
      retailer: { email: cart[0].retailerEmail } // Get from cart item
    })

    // Prepare Ozow payment request
    const amount = (cartTotal * 100).toFixed(0) // Ozow uses cents, no decimals
    const cancelUrl = `${baseUrl}/checkout/cancel`
    const errorUrl = `${baseUrl}/checkout/error`
    const successUrl = `${baseUrl}/checkout/success?orderId=${orderId}`
    const notifyUrl = `${baseUrl}/api/ozow/notify`
    
    // Generate hash for security (MUST be lowercase as per Ozow docs)
    // IMPORTANT: No spaces, exact order, all lowercase before hashing
    const inputString = `${siteCode}${amount}${orderId}${customer.email.toLowerCase()}${cancelUrl}${errorUrl}${successUrl}${notifyUrl}${isTest}${privateKey}`
    
    console.log('Hash input string:', inputString)
    
    const hashCheck = crypto
      .createHash('sha512')
      .update(inputString.toLowerCase())
      .digest('hex')
    
    console.log('Generated hash:', hashCheck)

    // Prepare Ozow form data (exactly as per their docs)
    const ozowFormData = {
      SiteCode: siteCode,
      CountryCode: 'ZA',
      CurrencyCode: 'ZAR',
      Amount: amount,
      TransactionReference: orderId,
      BankReference: `Stone Connect Order ${orderId.slice(0, 8)}`,
      Customer: `${customer.firstName} ${customer.lastName}`,
      Optional1: customer.phone || '',
      Optional2: '',
      Optional3: '',
      Optional4: '',
      Optional5: '',
      CancelUrl: cancelUrl,
      ErrorUrl: errorUrl,
      SuccessUrl: successUrl,
      NotifyUrl: notifyUrl,
      IsTest: isTest.toString(),
      HashCheck: hashCheck
    }

    console.log('Ozow payment initiated:', {
      orderId,
      amount: cartTotal,
      amountInCents: amount,
      customer: customer.email,
      isTest,
      siteCode,
      hashCheck: hashCheck.substring(0, 20) + '...',
      formData: {
        ...ozowFormData,
        HashCheck: hashCheck.substring(0, 20) + '...'
      }
    })

    // Return the form data - we'll POST it from the frontend
    return NextResponse.json({ 
      success: true,
      formData: ozowFormData,
      orderId,
      // Ozow payment URL
      ozowUrl: isTest 
        ? 'https://pay.ozow.com/'
        : 'https://pay.ozow.com/'
    })

  } catch (error) {
    console.error('Ozow payment initiation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}