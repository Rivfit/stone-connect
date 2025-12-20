import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { subscription, retailer } = await req.json()

    // Send email notification to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Admin email
        subject: '🎉 New Premium Subscription - Stone Connect',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">New Premium Subscription!</h1>
            
            <h2>Retailer Details:</h2>
            <ul>
              <li><strong>Business:</strong> ${retailer.business_name}</li>
              <li><strong>Email:</strong> ${retailer.email}</li>
              <li><strong>Phone:</strong> ${retailer.phone || 'N/A'}</li>
              <li><strong>City:</strong> ${retailer.city}, ${retailer.province}</li>
            </ul>
            
            <h2>Subscription Details:</h2>
            <ul>
              <li><strong>Plan:</strong> ${subscription.plan_type}</li>
              <li><strong>Price:</strong> R${subscription.plan_price}</li>
              <li><strong>Status:</strong> ${subscription.status}</li>
              <li><strong>Start Date:</strong> ${new Date(subscription.start_date).toLocaleDateString()}</li>
              <li><strong>Next Billing:</strong> ${new Date(subscription.next_billing_date).toLocaleDateString()}</li>
            </ul>
            
            <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <strong>Action Required:</strong> Activate premium features for this retailer once payment is confirmed.
            </p>
          </div>
        `
      })

      // Send confirmation to retailer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: retailer.email,
        subject: 'Premium Subscription Pending - Stone Connect',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Thank you for upgrading to Premium!</h1>
            
            <p>Your subscription is currently pending payment confirmation.</p>
            
            <h2>Subscription Details:</h2>
            <ul>
              <li><strong>Plan:</strong> ${subscription.plan_type === 'monthly' ? 'Monthly' : 'Annual'}</li>
              <li><strong>Price:</strong> R${subscription.plan_price}</li>
              <li><strong>Start Date:</strong> ${new Date(subscription.start_date).toLocaleDateString()}</li>
            </ul>
            
            <h3>What happens next?</h3>
            <ol>
              <li>Complete your payment</li>
              <li>Your premium features activate immediately</li>
              <li>Start getting featured in search results!</li>
            </ol>
            
            <p style="margin-top: 30px; color: #666;">
              Questions? Contact us at support@stoneconnect.co.za
            </p>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}