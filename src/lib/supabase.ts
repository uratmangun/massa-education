import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Course = {
  id: string
  title: string
  user_id: string
  sections: Array<{
    title: string
    content: string
  }>
  created_at: string
  updated_at: string
}