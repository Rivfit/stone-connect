import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Fetch all verification documents with retailer info
    const { data, error } = await supabase
      .from('verification_documents')
      .select(`
        *,
        retailers (
          business_name,
          email,
          business_type,
          registration_number
        )
      `)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Format the response
    const documents = data?.map(doc => ({
      id: doc.id,
      retailer_id: doc.retailer_id,
      retailer_name: doc.retailers?.business_name || 'Unknown',
      retailer_email: doc.retailers?.email || 'Unknown',
      business_type: doc.retailers?.business_type,
      registration_number: doc.retailers?.registration_number,
      document_type: doc.document_type,
      file_url: doc.file_url,
      file_name: doc.file_name,
      status: doc.status,
      uploaded_at: doc.uploaded_at,
      rejection_reason: doc.rejection_reason
    })) || []

    return NextResponse.json({
      success: true,
      documents
    })

  } catch (error) {
    console.error('❌ List documents error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}