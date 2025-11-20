import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { data: order, error } = await supabase
      .from('orders')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(order)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
