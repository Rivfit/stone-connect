import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { retailer_id, retailer_email, change_type, changes, banking, timestamp } = body

    // 1. Save to database (audit log)
    const { error: dbError } = await supabase
      .from('retailer_change_logs')
      .insert([{
        retailer_id,
        retailer_email,
        change_type,
        changes: changes || null,
        banking_info: banking || null,
        timestamp,
        created_at: new Date().toISOString()
      }])

    if (dbError) {
      console.error('Error saving to audit log:', dbError)
      // Continue even if DB save fails
    }

    // 2. Send email notification to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        const emailContent = change_type === 'banking_details' 
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h1 style="color: #dc2626;">🏦 Banking Details Updated</h1>
              <p><strong>Retailer:</strong> ${retailer_email}</p>
              <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
              
              <h2>New Banking Information:</h2>
              <ul>
                <li><strong>Bank:</strong> ${banking?.bank_name || 'N/A'}</li>
                <li><strong>Account Holder:</strong> ${banking?.account_holder || 'N/A'}</li>
                <li><strong>Account Type:</strong> ${banking?.account_type || 'N/A'}</li>
              </ul>
              
              <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 20px;">
                <strong>⚠️ Action Required:</strong> Verify these banking details before processing any payments.
              </p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h1 style="color: #2563eb;">📝 Account Details Updated</h1>
              <p><strong>Retailer:</strong> ${retailer_email}</p>
              <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
              
              <h2>Updated Information:</h2>
              <ul>
                ${changes?.business_name ? `<li><strong>Business Name:</strong> ${changes.business_name}</li>` : ''}
                ${changes?.phone ? `<li><strong>Phone:</strong> ${changes.phone}</li>` : ''}
                ${changes?.address ? `<li><strong>Address:</strong> ${changes.address}, ${changes.city}, ${changes.postal_code}</li>` : ''}
                ${changes?.province ? `<li><strong>Province:</strong> ${changes.province}</li>` : ''}
              </ul>
            </div>
          `

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin email
          subject: `[Stone Connect] Retailer ${change_type === 'banking_details' ? 'Banking' : 'Account'} Update - ${retailer_email}`,
          html: emailContent
        })

        console.log('✅ Admin notification sent')
      } catch (emailError) {
        console.error('⚠️ Failed to send admin email:', emailError)
      }
    }

    return NextResponse.json({ success: true, message: 'Changes logged successfully' })

  } catch (error) {
    console.error('❌ Error logging changes:', error)
    return NextResponse.json(
      { error: 'Failed to log changes' },
      { status: 500 }
    )
  }
}