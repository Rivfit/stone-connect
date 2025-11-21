// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import  nodemailer from 'nodemailer'

// Create Supabase client directly in this file
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cart, cartTotal, customer } = body

    // Validate inputs
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!customer?.email || !customer?.firstName) {
      return NextResponse.json({ error: 'Customer information is missing' }, { status: 400 })
    }

    // Calculate commission
    const commission = cartTotal * 0.1
    const retailerPayout = cartTotal - commission

    console.log('📦 Processing order:', { cartTotal, commission, customer: customer.email })

    // 1️⃣ Save order in Supabase
    const orderPayload = {
      deceased_name: cart.map((item: any) => item.deceasedName || item.productType).join(', '),
      custom_message: cart.map((item: any) => item.customMessage || '').filter(Boolean).join(' | '),
      product_price: cartTotal,
      platform_commission: commission,
      retailer_payout: retailerPayout,
      payment_status: 'pending',
      payment_id: null,
      order_status: 'pending',
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      customer_name: `${customer.firstName} ${customer.lastName}`,
      customer_address: `${customer.address}, ${customer.city}, ${customer.postalCode}`,
      created_at: new Date().toISOString(),
    }

    console.log('💾 Inserting into Supabase:', orderPayload)

    const { data: orderData, error } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase Insert Error:', error)
      // Continue anyway - don't block payment
      console.log('⚠️ Continuing without database save...')
    } else {
      console.log('✅ Order saved:', orderData?.id)
    }

    // 2️⃣ Send emails (optional - don't block if it fails)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        // Send customer email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: customer.email,
          subject: 'Order Confirmation - Stone Connect',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Thank you for your order!</h1>
              <p><strong>Total:</strong> R${cartTotal.toFixed(2)}</p>
              <p>Your retailer(s) will contact you within 24 hours to arrange delivery.</p>
              
              <h2>Order Details:</h2>
              <ul>
                ${cart.map((item: any) => `
                  <li>
                    <strong>${item.productType}</strong><br>
                    Material: ${item.material}<br>
                    Color: ${item.selectedColor}<br>
                    Price: R${item.basePrice}<br>
                    ${item.deceasedName ? `Name: ${item.deceasedName}<br>` : ''}
                    ${item.customMessage ? `Message: "${item.customMessage}"<br>` : ''}
                    Retailer: ${item.retailerName}
                  </li>
                `).join('')}
              </ul>
              
              <h2>Delivery Address:</h2>
              <p>${customer.address}<br>${customer.city}, ${customer.postalCode}</p>
              
              <p style="margin-top: 30px; color: #666;">
                Questions? Email us at support@stoneconnect.co.za
              </p>
            </div>
          `
        })

        // Send retailer emails
        const retailerEmails = [...new Set(cart.map((item: any) => item.retailerEmail).filter(Boolean))] as string[]
        
        for (const retailerEmail of retailerEmails) {
          const retailerItems = cart.filter((item: any) => item.retailerEmail === retailerEmail)
          
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: retailerEmail,
            subject: '🔔 New Order Received - Stone Connect',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #16a34a;">New Order Received!</h1>
                
                <h2>Customer Details</h2>
                <p>
                  <strong>Name:</strong> ${customer.firstName} ${customer.lastName}<br>
                  <strong>Email:</strong> ${customer.email}<br>
                  <strong>Phone:</strong> ${customer.phone}<br>
                  <strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.postalCode}
                </p>
                
                <h2>Order Items</h2>
                <ul>
                  ${retailerItems.map((item: any) => `
                    <li>
                      <strong>${item.productType}</strong><br>
                      Material: ${item.material}<br>
                      Color: ${item.selectedColor}<br>
                      Price: R${item.basePrice}<br>
                      ${item.deceasedName ? `Name to engrave: ${item.deceasedName}<br>` : ''}
                      ${item.customMessage ? `Custom message: "${item.customMessage}"<br>` : ''}
                    </li>
                  `).join('')}
                </ul>
                
                <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b;">
                  <strong>⚠️ Action Required:</strong> Please contact the customer within 24 hours to confirm the order and arrange delivery.
                </p>
                
                <p style="margin-top: 30px; color: #666;">
                  Your payout: R${(retailerItems.reduce((sum: number, item: any) => sum + item.basePrice, 0) * 0.9).toFixed(2)} (after 10% platform fee)
                </p>
              </div>
            `
          })
        }

        console.log('📧 Emails sent successfully')
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError)
      // Don't block payment if email fails
    }

    // 3️⃣ Generate PayFast URL
    const merchant_id = process.env.PAYFAST_MERCHANT_ID || '10043867'
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY || 'cs3kbgt7v5usq'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const return_url = `${baseUrl}/payment/success`
    const cancel_url = `${baseUrl}/payment/cancelled`
    const notify_url = `${baseUrl}/api/payfast-webhook`

    const payfastParams = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cartTotal.toFixed(2),
      item_name: 'Stone Connect Memorial Order',
      item_description: `${cart.length} memorial item(s)`,
      email_address: customer.email,
      name_first: customer.firstName,
      name_last: customer.lastName,
      cell_number: customer.phone || '',
      m_payment_id: orderData?.id || `ORD-${Date.now()}`
    }

    const query = new URLSearchParams(payfastParams).toString()
    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${query}`

    console.log('💳 PayFast URL generated')

    return NextResponse.json({ 
      payfastUrl, 
      orderId: orderData?.id || null,
      success: true 
    })

  } catch (err) {
    console.error('❌ Checkout Error:', err)
    return NextResponse.json({ 
      error: 'Order creation failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}