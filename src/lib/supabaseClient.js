import { createClient } from '@supabase/supabase-js'

// Supabase is used ONLY for auth in the admin panel's "Create Account" tab.
// Leads live in Firestore (see ./firebase.js) — this client touches no tables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
