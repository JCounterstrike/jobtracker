import { createClient } from "@supabase/supabase-js"

// Server-side client using service role key (bypasses RLS)
// This is safe because we validate authentication via NextAuth before using it

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL and Service Role Key are required in environment variables.")
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
