// app/api/send-review-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, productName, retailerName } = await request.json()

    // Create Nodemailer transporter (configure with your email settings)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderId}/review`

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Leave a Review - Stone Connect</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Stone Connect</h1>
                      <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 18px;">How was your experience?</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                        Hi ${customerName || 'there'},
                      </p>
                      
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                        Thank you for your recent order! We hope you're satisfied with your <strong>${productName}</strong> from <strong>${retailerName}</strong>.
                      </p>
                      
                      <p style="margin: 0 0 30px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                        We'd love to hear about your experience. Your feedback helps us improve and helps other families make informed decisions.
                      </p>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                              ⭐ Leave a Review
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6; text-align: center;">
                        It only takes 2 minutes and means the world to us!
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                        Stone Connect - Connecting Families with Quality Memorial Retailers
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                        📞 +27 83 574 7160 | 📧 rerglobalventures@gmail.com
                      </p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #2563eb; text-decoration: none;">Visit Stone Connect</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    // Plain text version
    const textContent = `
Hi ${customerName || 'there'},

Thank you for your recent order! We hope you're satisfied with your ${productName} from ${retailerName}.

We'd love to hear about your experience. Please leave a review at:
${reviewUrl}

It only takes 2 minutes and means the world to us!

Best regards,
Stone Connect Team

Stone Connect - Connecting Families with Quality Memorial Retailers
📞 +27 83 574 7160 | 📧 rerglobalventures@gmail.com
Visit us: ${process.env.NEXT_PUBLIC_SITE_URL}
    `

    // Send email
    await transporter.sendMail({
      from: `"Stone Connect" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: '⭐ How was your experience? Leave a review',
      text: textContent,
      html: htmlContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending review email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// ========================================
// UTILITY FUNCTION TO SEND REVIEW EMAIL
// ========================================
// You can call this function after an order is completed/delivered

export async function sendReviewEmail(orderData: {
  orderId: string
  customerEmail: string
  customerName?: string
  productName: string
  retailerName: string
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-review-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Failed to send review email')
    }

    console.log('Review email sent successfully')
    return true
  } catch (error) {
    console.error('Error sending review email:', error)
    return false
  }
}

// ========================================
// EXAMPLE USAGE
// ========================================
// When order status changes to "completed" or "delivered":
/*
import { sendReviewEmail } from '@/app/api/send-review-email/route'

// After order completion
await sendReviewEmail({
  orderId: order.id,
  customerEmail: order.customer_email,
  customerName: order.customer_name, // optional
  productName: `${order.products.type} - ${order.products.material}`,
  retailerName: order.retailers.business_name
})
*/