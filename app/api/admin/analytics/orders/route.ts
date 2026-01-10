// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders_main')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Transform data to include customer and retailer info from JSONB
    const transformedOrders = orders?.map(order => ({
      ...order,
      customer: order.customer_data,
      retailer: {
        email: order.retailer_email
      }
    }))

    return NextResponse.json(transformedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}