// app/api/admin/approve-document/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to get admin client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is secret!
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    // Create the admin client inside the request handler
    const supabaseAdmin = getSupabaseAdmin()
    
    const { documentId, action, rejectionReason } = await req.json()

    // TODO: Add admin authentication check here
    // For now, assuming the request is from admin dashboard
    
    if (action === 'approve') {
      const { error } = await supabaseAdmin
        .from('verification_documents')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
          rejection_reason: null
        })
        .eq('id', documentId)

      if (error) throw error

      return NextResponse.json({ 
        success: true, 
        message: 'Document approved' 
      })
    } 
    else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { success: false, error: 'Rejection reason required' },
          { status: 400 }
        )
      }

      const { error } = await supabaseAdmin
        .from('verification_documents')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
          rejection_reason: rejectionReason
        })
        .eq('id', documentId)

      if (error) throw error

      return NextResponse.json({ 
        success: true, 
        message: 'Document rejected' 
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Admin approval error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'