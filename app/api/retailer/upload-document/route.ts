import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    const retailerId = formData.get('retailerId') as string

    if (!file || !documentType || !retailerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${retailerId}/${documentType}_${timestamp}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(fileName)

    // Save document record to database
    const { error: dbError } = await supabase
      .from('verification_documents')
      .insert([{
        retailer_id: retailerId,
        document_type: documentType,
        file_url: publicUrl,
        file_name: file.name,
        status: 'pending',
        uploaded_at: new Date().toISOString()
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway - file was uploaded
    }

    // Update retailer verification status
    await supabase
      .from('retailers')
      .update({ verification_status: 'pending' })
      .eq('id', retailerId)

    // Notify admin via email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.ADMIN_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        // Get retailer details
        const { data: retailerData } = await supabase
          .from('retailers')
          .select('business_name, email')
          .eq('id', retailerId)
          .single()

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `📄 New Document Upload - ${retailerData?.business_name}`,
          html: `
            <h2>New Verification Document Uploaded</h2>
            <p><strong>Retailer:</strong> ${retailerData?.business_name}</p>
            <p><strong>Email:</strong> ${retailerData?.email}</p>
            <p><strong>Document Type:</strong> ${documentType.replace('_', ' ').toUpperCase()}</p>
            <p><strong>File Name:</strong> ${file.name}</p>
            <p><strong>Uploaded:</strong> ${new Date().toLocaleString()}</p>
            <p><a href="${publicUrl}" target="_blank">View Document</a></p>
            <hr>
            <p><strong>Action Required:</strong> Review and approve/reject this document in the admin panel.</p>
          `
        })

        console.log('✅ Admin notification sent')
      } catch (emailError) {
        console.error('⚠️ Email notification failed:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      message: 'Document uploaded successfully'
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}