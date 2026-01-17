import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // 1. Log the variables to the browser console to see if they are being read
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  // 2. Pass them to the client
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}