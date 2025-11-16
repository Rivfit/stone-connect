import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connected! ✅',
      products_count: count || 0,
      sample_products: data?.slice(0, 2) || []
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Connection failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
