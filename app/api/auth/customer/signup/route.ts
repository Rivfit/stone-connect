import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone, address, city, postalCode, agreedToTerms, agreedAt } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !agreedToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create customer account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: 'customer'
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Save customer details in customers table
    const { error: dbError } = await supabase
      .from('customers')
      .insert([{
        id: authData.user?.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postal_code: postalCode || null,
        agreed_to_terms: true,
        terms_agreed_at: agreedAt,
        created_at: new Date().toISOString()
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway - auth user was created
    }

    // Send welcome email
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
          subject: 'Welcome to Stone Connect!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Stone Connect! 🎉</h1>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hello ${firstName}!</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Thank you for creating an account with Stone Connect. We're here to help you find the perfect memorial for your loved ones.
                </p>

                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Your Account Benefits</h3>
                  <ul style="color: #4b5563; padding-left: 20px;">
                    <li>Track your orders in real-time</li>
                    <li>View complete order history</li>
                    <li>Save delivery addresses</li>
                    <li>Receive order updates via email</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/login" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Login to Your Account
                  </a>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/products" style="display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Browse Memorials
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
                  This email was sent to ${email} because you created an account on Stone Connect.<br>
                  © 2025 Stone Connect / RER Global Ventures (Pty) Ltd. All rights reserved.
                </p>
              </div>
            </div>
          `
        })

        console.log('✅ Welcome email sent to customer')
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError)
        // Don't block signup if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Customer account created successfully'
    })

  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}