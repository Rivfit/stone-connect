import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to get admin client
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    const { documentId, action, rejectionReason } = await req.json()

    console.log('📝 Document action:', { documentId, action, rejectionReason })
    
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

      if (error) {
        console.error('❌ Approve error:', error)
        throw error
      }

      console.log('✅ Document approved:', documentId)
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

      if (error) {
        console.error('❌ Reject error:', error)
        throw error
      }

      console.log('✅ Document rejected:', documentId)
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
    console.error('💥 Admin approval error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'