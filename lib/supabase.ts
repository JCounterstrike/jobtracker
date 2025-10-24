import { createClient } from "@supabase/supabase-js"

// Extract the project URL from your DATABASE_URL
// Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
// Supabase URL: https://PROJECT_REF.supabase.co

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
