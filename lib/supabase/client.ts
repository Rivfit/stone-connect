import { createClient } from '@supabase/supabase-js'

// ✅ export a ready-to-use client instance
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
