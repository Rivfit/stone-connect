// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Total paid orders from orders_main
    const { data: orders, error: ordersError } = await supabase
      .from('orders_main')
      .select('*')
      .eq('payment_status', 'paid');

    if (ordersError) throw ordersError;

    // Revenue (10% commission)
    const totalRevenue = orders.reduce((acc, o: any) => acc + parseFloat(o.commission || 0), 0);
    const totalSales = orders.reduce((acc, o: any) => acc + parseFloat(o.cart_total || 0), 0);

    // Total site visits (if you have this table)
    let totalVisits = 0;
    try {
      const { count: visitsCount } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });
      totalVisits = visitsCount || 0;
    } catch (error) {
      console.log('Visits table not found, skipping...');
    }

    // Active premium subscriptions
    const { count: totalSubscriptions, error: subsError } = await supabase
      .from('retailers')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true);

    if (subsError) throw subsError;

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue,
      totalSales,
      totalVisits,
      totalSubscriptions: totalSubscriptions || 0
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}