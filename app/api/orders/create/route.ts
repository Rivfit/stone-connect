import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data: order, error } = await supabase
      .from('orders')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(order)
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
