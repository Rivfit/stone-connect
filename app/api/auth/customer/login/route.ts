// app/api/customer/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    console.log('🔐 Customer login attempt:', email)

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Login error:', error.message)
      return NextResponse.json({ 
        error: error.message || 'Invalid email or password' 
      }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ 
        error: 'Login failed' 
      }, { status: 401 })
    }

    // Get customer details from database
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (customerError) {
      console.error('⚠️ Customer record not found:', customerError)
      // Continue anyway - they have auth but no customer record
    }

    console.log('✅ Customer logged in successfully:', email)

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: customer?.first_name || data.user.user_metadata?.first_name,
        lastName: customer?.last_name || data.user.user_metadata?.last_name,
        phone: customer?.phone,
        address: customer?.address,
        city: customer?.city,
        postalCode: customer?.postal_code
      },
      session: data.session
    })

  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}