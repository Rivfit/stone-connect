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
    const amount = cartTotal.toFixed(2) // Ozow wants decimal format like "527.50"
    const bankReference = `Order ${orderId.slice(0, 8)}`
    const customerName = `${customer.firstName} ${customer.lastName}`
    const optional1 = customer.email
    const optional2 = customer.phone || ''
    const optional3 = customer.address || ''
    const optional4 = `${customer.city || ''} ${customer.postalCode || ''}`
    const optional5 = ''
    const cancelUrl = `${baseUrl}/checkout/cancel`
    const errorUrl = `${baseUrl}/checkout/error`
    const successUrl = `${baseUrl}/checkout/success?orderId=${orderId}`
    const notifyUrl = `${baseUrl}/api/ozow/notify`
    
    // Generate hash for security
    // Per Ozow docs: SiteCode + CountryCode + CurrencyCode + Amount + TransactionReference + BankReference + Optional1-5 + Customer + CancelUrl + ErrorUrl + SuccessUrl + NotifyUrl + IsTest + PrivateKey
    const inputString = [
      siteCode,
      'ZA', // CountryCode
      'ZAR', // CurrencyCode
      amount,
      orderId, // TransactionReference
      bankReference,
      optional1,
      optional2,
      optional3,
      optional4,
      optional5,
      customerName, // Customer field IS included in hash
      cancelUrl,
      errorUrl,
      successUrl,
      notifyUrl,
      isTest.toString(),
      privateKey
    ].join('')
    
    console.log('Hash input components:', {
      siteCode,
      countryCode: 'ZA',
      currencyCode: 'ZAR',
      amount,
      transactionRef: orderId,
      bankRef: bankReference,
      customer: customerName,
      isTest: isTest.toString(),
      inputStringLength: inputString.length
    })
    
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
      Amount: parseFloat(amount), // Send as number
      TransactionReference: orderId,
      BankReference: bankReference,
      Customer: customerName,
      Optional1: optional1,
      Optional2: optional2,
      Optional3: optional3,
      Optional4: optional4,
      Optional5: optional5,
      CancelUrl: cancelUrl,
      ErrorUrl: errorUrl,
      SuccessUrl: successUrl,
      NotifyUrl: notifyUrl,
      IsTest: isTest,
      HashCheck: hashCheck
    }

    console.log('Ozow payment initiated:', {
      orderId,
      amount: cartTotal,
      customer: customer.email,
      isTest,
      siteCode,
      hashCheck: hashCheck.substring(0, 20) + '...'
    })

    // Return the form data - we'll POST it from the frontend
    return NextResponse.json({ 
      success: true,
      formData: ozowFormData,
      orderId,
      // Ozow payment URL
      ozowUrl: 'https://pay.ozow.com/'
    })

  } catch (error) {
    console.error('Ozow payment initiation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}