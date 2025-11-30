import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    // Total completed orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'completed');

    if (ordersError) throw ordersError;

    // Revenue (10% commission)
    const totalRevenue = orders.reduce((acc, o: any) => acc + o.amount * 0.1, 0);
    const totalSales = orders.reduce((acc, o: any) => acc + o.amount, 0);

    // Total site visits
    const { count: totalVisits, error: visitsError } = await supabase
      .from('visits')
      .select('*', { count: 'exact' });

    if (visitsError) throw visitsError;

    // Active premium subscriptions
    const { count: totalSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .eq('plan', 'premium');

    if (subsError) throw subsError;

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue,
      totalSales,
      totalVisits,
      totalSubscriptions
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
