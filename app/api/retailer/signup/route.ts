import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { businessName, email, password, phone, address, isPremium, agreedToAgreement, agreedAt } = await req.json()

    // Validate required fields
    if (!businessName || !email || !password || !agreedToAgreement) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create retailer account in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
          user_type: 'retailer'
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Save retailer details
    const { error: dbError } = await supabase
      .from('retailers')
      .insert([{
        id: authData.user?.id,
        business_name: businessName,
        email,
        phone,
        address,
        is_premium: isPremium,
        agreed_to_agreement: true,
        agreement_agreed_at: agreedAt,
        created_at: new Date().toISOString()
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway - auth user was created
    }

    // Send welcome email with Seller Agreement
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to Stone Connect - Seller Agreement',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Stone Connect! 🎉</h1>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hello ${businessName}!</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Thank you for joining Stone Connect as a retailer. We're excited to have you on board!
                </p>

                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Your Account Details</h3>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Business Name:</strong> ${businessName}</p>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Account Type:</strong> ${isPremium ? '⭐ Premium' : 'Free'}</p>
                </div>

                <h3 style="color: #1f2937;">📄 Important Documents</h3>
                <p style="color: #4b5563;">
                  As agreed during registration, please review the following documents:
                </p>
                
                <div style="margin: 20px 0;">
                  <a href="${baseUrl}/legal/seller-agreement" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px;">
                    📋 View Seller Agreement
                  </a>
                  <a href="${baseUrl}/legal/seller-terms" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px;">
                    📜 Terms of Service
                  </a>
                </div>

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #92400e;">
                    <strong>⚠️ Next Steps:</strong><br>
                    1. Log in to your dashboard<br>
                    2. Complete your profile<br>
                    3. Add your first product listing<br>
                    4. Set up banking details for payments
                  </p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/retailer/login" style="display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Login to Dashboard
                  </a>
                </div>

                <h3 style="color: #1f2937;">Need Help?</h3>
                <p style="color: #4b5563;">
                  Our support team is here to assist you:<br>
                  📧 Email: support@stoneconnect.co.za<br>
                  📞 Phone: +27 12 345 6789
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  This email was sent to ${email} because you registered as a retailer on Stone Connect.<br>
                  © 2025 Stone Connect / RER Global Ventures (Pty) Ltd. All rights reserved.
                </p>
              </div>
            </div>
          `
        })

        console.log('✅ Welcome email sent to retailer')
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError)
        // Don't block signup if email fails
      }
    }

    // Notify admin
    if (process.env.ADMIN_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `🆕 New Retailer Signup - ${businessName}`,
          html: `
            <h2>New Retailer Registered</h2>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Premium:</strong> ${isPremium ? 'Yes ⭐' : 'No'}</p>
            <p><strong>Agreed to Agreement:</strong> Yes (${new Date(agreedAt).toLocaleString()})</p>
          `
        })
      } catch (err) {
        console.error('Admin notification failed:', err)
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Retailer account created successfully'
    })

  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}