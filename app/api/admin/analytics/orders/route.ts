import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, customer:customer_id(*), retailer:retailer_id(*)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
