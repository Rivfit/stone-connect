import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*, retailer:retailer_id(*)')
      .eq('status', 'active')
      .eq('plan', 'premium')
      .order('start_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(subscriptions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
