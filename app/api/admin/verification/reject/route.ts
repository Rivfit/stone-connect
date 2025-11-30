import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { documentId, rejectionReason } = await req.json()

    if (!documentId || !rejectionReason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get document details
    const { data: doc, error: fetchError } = await supabase
      .from('verification_documents')
      .select(`
        *,
        retailers (
          business_name,
          email
        )
      `)
      .eq('id', documentId)
      .single()

    if (fetchError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update document status to rejected
    const { error: updateError } = await supabase
      .from('verification_documents')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
    }

    // Update retailer verification status to pending (they need to re-upload)
    await supabase
      .from('retailers')
      .update({ verification_status: 'pending' })
      .eq('id', doc.retailer_id)

    // Send rejection email to retailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        const documentName = doc.document_type.replace('_', ' ').toUpperCase()
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: doc.retailers?.email,
          subject: `❌ Document Rejected - ${doc.retailers?.business_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Document Rejected</h1>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hello ${doc.retailers?.business_name},</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Unfortunately, your <strong>${documentName}</strong> could not be approved.
                </p>

                <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: bold;">
                    Rejection Reason:
                  </p>
                  <p style="margin: 0; color: #7f1d1d;">
                    ${rejectionReason}
                  </p>
                </div>

                <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #1e40af; font-weight: bold;">
                    📤 What to do next:
                  </p>
                  <ol style="margin: 10px 0 0 0; padding-left: 20px; color: #1e3a8a;">
                    <li>Review the rejection reason above</li>
                    <li>Prepare a corrected version of your document</li>
                    <li>Upload the new document in your dashboard</li>
                    <li>We'll review it within 24-48 hours</li>
                  </ol>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/dashboard/retailer/verification" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Upload Corrected Document
                  </a>
                </div>

                <h3 style="color: #1f2937;">Need Help?</h3>
                <p style="color: #4b5563;">
                  If you have questions about the rejection:<br>
                  📧 Email: support@stoneconnect.co.za<br>
                  📞 Phone: +27 12 345 6789
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  © 2025 Stone Connect / RER Global Ventures (Pty) Ltd. All rights reserved.
                </p>
              </div>
            </div>
          `
        })

        console.log('✅ Rejection email sent to retailer')
      } catch (emailError) {
        console.error('⚠️ Email notification failed:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document rejected and retailer notified'
    })

  } catch (error) {
    console.error('❌ Reject error:', error)
    return NextResponse.json(
      { error: 'Failed to reject document' },
      { status: 500 }
    )
  }
}