
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nwjmjhzpmziefhemssqy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53am1qaHpwbXppZWZoZW1zc3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDA5NjgsImV4cCI6MjAyMzYxNjk2OH0.w6h0C9hxRMrE2Ek5MImVj9cqmzIAYEc_hBsn6PS1xyk"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase