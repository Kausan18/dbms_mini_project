// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for frontend use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (for API routes — same for now, swap for service role key later when adding auth)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)